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

# ── Enhanced multi-language routing prompt ────────────────────────────────────────────
router_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            f"""
You are a high-precision routing agent for an Odia AI assistant that MUST be factually accurate.
You can understand queries in multiple languages and scripts but always route based on intent.

LANGUAGE SUPPORT:
• Odia in Odia script: "ଓଡ଼ିଶାର ବର୍ତ୍ତମାନର ମୁଖ୍ୟମନ୍ତ୍ରୀ କିଏ?"
• Odia in English script (romanized): "Odisha ra bartaman mukhyamantri kie?"
• Hinglish/Hindi-English mix: "Odisha ka CM kaun hai?" or "Odisha ke CM kon he?"
• Pure English: "Who is the CM of Odisha?"

UNDERSTAND THESE EQUIVALENT TERMS ACROSS LANGUAGES:
• CM/Chief Minister: "ମୁଖ୍ୟମନ୍ତ୍ରୀ", "mukhyamantri", "CM", "chief minister"
• Current/Now: "ବର୍ତ୍ତମାନ", "bartaman", "current", "abhi", "ab"
• Who: "କିଏ", "kie", "kaun", "kon", "who"
• Weather: "ପାଗ", "paaga", "mausam", "weather"
• What: "କଣ", "kana", "kya", "what"
• Where: "କେଉଁଠି", "keunthi", "kahan", "where"
• When: "କେବେ", "kebe", "kab", "when"
• How: "କିପରି", "kipari", "kaise", "how"
• Today: "ଆଜି", "aaji", "aaj", "today"
• Tomorrow: "କାଲି", "kaali", "kal", "tomorrow"
• Day After Tomorrow: "ପରେ କାଲି", "pare kaali", "par kal", "day after tomorrow"
• Yesterday: "ଗତକାଲି", "gatakaali", "kal", "yesterday"

Current date: {datetime.utcnow().date()} (Use this for "current" questions)

ROUTING RULES:
• "weather" → Any weather/temperature/forecast questions in ANY language:
    - "ଭୁବନେଶ୍ୱରରେ ପାଗ କେମିତି ଅଛି?" (Odia)
    - "Bhubaneswar re paag kemiti achhi?" (Romanized Odia)
    - "Bhubaneswar mein mausam kaisa hai?" (Hinglish)
    - "What is the weather like in Bhubaneswar?" (English)
    - Weather indicators: rain/barsha, hot/garmi, cold/thanda, sunny/dhoop

• "research" → Questions needing verified current facts in ANY language:
  - Current office holders: CM, PM, President, Ministers, MLAs, MPs
  - Recent appointments or leadership changes
  - Current political party affiliations
  - Recent events, news, developments
  - Election results (2024, 2025)
  - Examples across languages:
    * "ଓଡ଼ିଶାର ବର୍ତ୍ତମାନର ମୁଖ୍ୟମନ୍ତ୍ରୀ କିଏ?" (Odia)
    * "Odisha ra CM kie?" (Romanized Odia)
    * "Odisha ka CM kaun hai?" (Hinglish)
    * "Who is the current CM of Odisha?" (English)
  - Keywords in any language: current/bartaman/abhi, latest/natun, now/ekhani, today/aaji/aaj

• "response" → Only for stable knowledge and casual chat:
  - Historical facts that don't change
  - General greetings: "namaskar", "hello", "kemiti achha"
  - Cultural questions about Odisha
  - Definitions and explanations
  - Creative requests (stories/galpa, poems/kabita)

CRITICAL POLITICAL TERMS TO RECOGNIZE:
• BJP: "ବିଜେପି", "BJP", "Bharatiya Janata Party", "bhajapa"
• BJD: "ବିଜଦ", "BJD", "Biju Janata Dal", "bijad"
• Congress: "କଂଗ୍ରେସ", "Congress", "kaangress"
• CM: "ସିଏମ", "ମୁଖ୍ୟମନ୍ତ୍ରୀ", "CM", "mukhyamantri", "chief minister"

EXAMPLES WITH CORRECT ROUTING:
✅ "Odisha ra CM kie?" → "research" (current position needs verification)
✅ "ଓଡ଼ିଶାର ରାଜଧାନୀ କଣ?" → "response" (capital doesn't change)
✅ "Bhubaneswar mein paani barsa raha hai?" → "weather" (weather query)
✅ "Kemiti achha?" → "response" (casual greeting)

SAFETY OVERRIDE: If uncertain between research/response for factual queries, choose "research".

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
    
    # Enhanced multi-language safety check for factual questions
    factual_keywords_multilang = [
        # English
        "current", "latest", "now", "today", "who is", "chief minister", 
        "prime minister", "president", "2024", "2025", "elected", "appointed",
        # Odia romanized
        "bartaman", "kie", "mukhyamantri", "aaji", "ekhani",
        # Hinglish/Hindi
        "kaun", "kon", "abhi", "aaj", "chief minister", "CM",
        # Mixed terms
        "odisha ra", "odisha ka", "odisha re"
    ]
    
    if any(keyword.lower() in user_message.lower() for keyword in factual_keywords_multilang):
        # Additional check for weather terms to avoid false positives
        weather_terms = ["paag", "mausam", "weather", "barsha", "rain", "garmi", "hot", "thanda", "cold"]
        is_weather = any(weather_term.lower() in user_message.lower() for weather_term in weather_terms)
        
        if decision.next_agent != "research" and not is_weather:
            print("🚨 MULTILANG SAFETY OVERRIDE: Factual keywords detected, forcing research")
            decision.next_agent = "research"
    
    return {"next_agent": decision.next_agent}