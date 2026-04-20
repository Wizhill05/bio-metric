from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from dotenv import load_dotenv

# Load env before importing crew logic
load_dotenv()

from crew_logic import run_health_research_crew

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    query: str
    history: Optional[List[Message]] = []

class FollowupRequest(BaseModel):
    query: str
    answer: str

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    if not req.query:
        raise HTTPException(status_code=400, detail="Query is required")

    try:
        formatted_history = "\n".join(
            [f"{msg.role.upper()}: {msg.content}" for msg in req.history[-6:]]
        ) if req.history else "No previous history."
        result_dict = run_health_research_crew(req.query, formatted_history)
        return result_dict
    except Exception as e:
        print(f"Error executing crew: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/followup")
async def followup_endpoint(req: FollowupRequest):
    """Generate 3 follow-up questions on the same health topic using Mistral directly."""
    try:
        from litellm import completion
        response = completion(
            model="mistral/mistral-medium-latest",
            api_key=os.environ.get("MISTRAL_API_KEY"),
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a health research assistant. Given an original query, generate exactly 3 "
                        "concise, natural follow-up questions that explore related aspects of the same health topic. "
                        "Return ONLY a valid JSON array of 3 question strings with no extra text or markdown. "
                        'Example: ["What are the long-term side effects of X?", "How does X compare to Y?", "What populations benefit most from X?"]'
                    ),
                },
                {
                    "role": "user",
                    "content": f"Original query: {req.query}\n\nGenerate 3 follow-up questions on this health topic.",
                },
            ],
            temperature=0.7,
        )
        raw = response.choices[0].message.content.strip()
        # Strip markdown fences if present
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        questions = json.loads(raw.strip())
        if not isinstance(questions, list):
            questions = [str(questions)]
        return {"questions": questions[:3]}
    except Exception as e:
        print(f"Error generating follow-up questions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
