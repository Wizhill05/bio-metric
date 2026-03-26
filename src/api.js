import { RESEARCH_PROMPT, ANSWER_PROMPT } from "./systemPrompt";

export async function fetchHealthResearch(query, historyPayload = []) {
  // Hardcoded for project deployment as requested
  const apiKey = "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";
  if (!apiKey) {
    throw new Error("Groq API Key is missing.");
  }

  // Ensure history is capped to last 6 messages to avoid context blowup
  const recentHistory = historyPayload.slice(-6);

  // ==========================================
  // STEP 1: RESEARCH AGENT (Pulls Papers)
  // ==========================================
  const researchResponse = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: RESEARCH_PROMPT },
          ...recentHistory,
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    },
  );

  if (!researchResponse.ok) {
    throw new Error(
      "Phase 1 (Research) failed to fetch papers. Please try again.",
    );
  }

  const researchData = await researchResponse.json();
  const researchContent = JSON.parse(researchData.choices[0].message.content);

  // Instant Refusal on Guardrails during Phase 1
  if (researchContent.refused) {
    return {
      answer: `I must respectfully decline to answer this query due to strict safety guardrails (${researchContent.reason}). I cannot provide explicit medical directives, assist with dangerous synthesis, or fulfill non-health-related requests.`,
      papers: [],
    };
  }

  // ==========================================
  // STEP 2: ANSWER AGENT (Synthesizes Data)
  // ==========================================
  const contextForAnswer = `
CRITICAL CONTEXT INJECTION FOR THIS EXACT TURN:
Your research assistant synthesized the following scientific papers based on the current context:
${JSON.stringify(researchContent.papers, null, 2)}

Please respond to the user's latest query using ONLY this evidence.
`;

  // We append the generated research context to the final user query block in memory.
  const finalHistory = [...recentHistory];
  const lastUserMsg = finalHistory.pop();

  finalHistory.push({
    role: "user",
    content: `${lastUserMsg.content}\n\n${contextForAnswer}`,
  });

  const answerResponse = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: ANSWER_PROMPT }, ...finalHistory],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    },
  );

  if (!answerResponse.ok) {
    throw new Error(
      "Phase 2 (Analysis) failed to generate a response from the papers.",
    );
  }

  const answerData = await answerResponse.json();

  try {
    return JSON.parse(answerData.choices[0].message.content);
  } catch (e) {
    console.error(
      "Failed to parse Final JSON:",
      answerData.choices[0].message.content,
    );
    throw new Error("Invalid output format from Final LLM Analysis.");
  }
}
