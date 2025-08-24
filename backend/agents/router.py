import os
from datetime import datetime
from typing import Literal

from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from pydantic import BaseModel, Field

# ── Model setup ───────────────────────────────────────────────────
GROQ_MODEL_NAME = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
llm = ChatGroq(model=GROQ_MODEL_NAME, temperature=0)

# ── Structured output schema ──────────────────────────────────────
class RouteQuery(BaseModel):
    """Choose the next agent for the user query."""
    next_agent: Literal["research", "weather", "response"] = Field(
        ...,
        description=(
            "Exactly one of: "
            "'research' (needs fresh factual data), "
            "'weather' (weather-related), "
            "'response' (general chat)."
        ),
    )

structured_router = llm.with_structured_output(RouteQuery)

# ── Fixed routing prompt with proper escaping ────────────────────────────────────────────
router_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            f"""
You are a high-precision routing agent for an Odia AI assistant that MUST be factually accurate.

Current date: {datetime.utcnow().date()} (Use this for "current" questions)

ROUTING RULES:
• "weather" → Any weather/temperature/forecast questions:
    - "What is the weather like in Bhubaneswar?"
    - "Will it rain tomorrow?"
    - "What's the temperature in Cuttack?"
    - "Is it going to be sunny this week?"
    - "Will it be humid in Puri?"
    - "What will the weather be like next weekend?"
• "research" → Questions that need verified current facts, including:
  - Current office holders (CM, PM, President, Ministers, etc.)  
  - Recent appointments or changes in leadership
  - Current political party affiliations
  - Recent events, news, or developments
  - "Who is the current..." questions
  - Questions about 2024 elections/results
  - Any factual claim that could have changed recently
  - Questions with words: "current", "latest", "now", "today", "2024", "2025"
• "response" → Only for:
  - General knowledge that doesn't change (history, definitions, explanations)
  - Casual greetings and conversations
  - Cultural questions
  - How-to questions
  - Creative requests (stories, poems)

CRITICAL: Political and administrative positions change frequently. 
When in doubt about current facts, choose "research" to ensure accuracy.

EXAMPLES:
❌ "Who is CM of Odisha?" → "response" (WRONG - this changes and needs research)
✅ "Who is CM of Odisha?" → "research" (CORRECT - current position needs verification)
✅ "What is the capital of Odisha?" → "response" (CORRECT - this doesn't change)
✅ "How are you?" → "response" (CORRECT - casual conversation)
✅ "Weather in Bhubaneswar?" → "weather" (CORRECT - weather query)

Return JSON with next_agent field containing your choice.
            """,
        ),
        (
            "human",
            "USER MESSAGE:\n{user_message}\n\nCONVERSATION CONTEXT:\n{history}",
        ),
    ]
)

# ── Router node function ──────────────────────────────────────────
def get_route(state):
    """Return {'next_agent': <str>} based on the latest user message."""
    messages = state["messages"]
    user_message = messages[-1].content.strip()
    history = "\n".join(f"{m.type}: {m.content}" for m in messages[:-1])

    decision = (router_prompt | structured_router).invoke(
        {"user_message": user_message, "history": history}
    )

    print(f"--- ROUTER DECISION: {decision.next_agent} ---")
    print(f"📝 Query: {user_message[:50]}...")
    
    # Additional safety check for common factual questions
    factual_keywords = [
        "current", "latest", "now", "today", "who is", "chief minister", 
        "prime minister", "president", "2024", "2025", "elected", "appointed"
    ]
    
    if any(keyword in user_message.lower() for keyword in factual_keywords):
        if decision.next_agent != "research" and "weather" not in user_message.lower():
            print("🚨 SAFETY OVERRIDE: Factual keywords detected, forcing research")
            decision.next_agent = "research"
    
    return {"next_agent": decision.next_agent}