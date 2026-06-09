from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import asyncio
from functools import partial
from dotenv import load_dotenv

# Load env before importing crew logic
load_dotenv()

# Globally drop unsupported params for all litellm calls
import litellm
litellm.drop_params = True

# --- Fix for CrewAI #5886 ---
# CrewAI unconditionally calls mark_cache_breakpoint() on ALL messages,
# but only the Anthropic adapter strips cache_breakpoint before sending.
# For Mistral/Groq/OpenAI providers, cache_breakpoint stays in the message
# dict and the API rejects it. Neutralize the function to a no-op.
_noop_cache = lambda msg: msg
try:
    import crewai.llms.cache as _crewai_cache
    _crewai_cache.mark_cache_breakpoint = _noop_cache
except (ImportError, AttributeError):
    pass
# Also patch the agent executor modules that may bind the function directly
# via `from crewai.llms.cache import mark_cache_breakpoint`
try:
    import crewai.agents.crew_agent_executor as _cae
    _cae.mark_cache_breakpoint = _noop_cache
except (ImportError, AttributeError):
    pass
try:
    import crewai.experimental.agent_executor as _eae
    _eae.mark_cache_breakpoint = _noop_cache
except (ImportError, AttributeError):
    pass

# Belt-and-suspenders: also strip cache_breakpoint from messages at the
# litellm.completion level in case anything else injects it.
_orig_completion = litellm.completion
_orig_acompletion = litellm.acompletion


def _strip_cache_fields(messages):
    """Remove cache_breakpoint/cache_control from every message dict."""
    if not messages:
        return
    for msg in messages:
        if isinstance(msg, dict):
            msg.pop("cache_breakpoint", None)
            msg.pop("cache_control", None)
            content = msg.get("content")
            if isinstance(content, list):
                for block in content:
                    if isinstance(block, dict):
                        block.pop("cache_breakpoint", None)
                        block.pop("cache_control", None)


def _patched_completion(*args, **kwargs):
    _strip_cache_fields(kwargs.get("messages"))
    if len(args) > 1 and isinstance(args[1], list):
        _strip_cache_fields(args[1])
    return _orig_completion(*args, **kwargs)


async def _patched_acompletion(*args, **kwargs):
    _strip_cache_fields(kwargs.get("messages"))
    if len(args) > 1 and isinstance(args[1], list):
        _strip_cache_fields(args[1])
    return await _orig_acompletion(*args, **kwargs)


litellm.completion = _patched_completion
litellm.acompletion = _patched_acompletion

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
        formatted_history = (
            "\n".join(
                [f"{msg.role.upper()}: {msg.content}" for msg in req.history[-6:]]
            )
            if req.history
            else "No previous history."
        )
        loop = asyncio.get_event_loop()
        result_dict = await loop.run_in_executor(
            None, partial(run_health_research_crew, req.query, formatted_history)
        )
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
            drop_params=True,
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
