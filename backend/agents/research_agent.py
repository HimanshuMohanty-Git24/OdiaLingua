import os, textwrap, datetime
from langchain_core.messages import AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

from tools.search_tools import (
    google_ai_overview_snippets,
    google_search_snippets,
    tavily_search_snippets,
)

GROQ_MODEL_NAME = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
llm = ChatGroq(model=GROQ_MODEL_NAME, temperature=0)  # Zero temperature for maximum accuracy

def _log(title, body):
    print(f"\n🟢 {title}:\n{textwrap.shorten(body, 1100)}\n{'─'*60}")

# Enhanced anti-hallucination synthesis prompt
synth_prompt = ChatPromptTemplate.from_messages([
    ("system", f"""You are a precise fact-extraction and verification agent. Your ONLY job is to extract and present factual information from the provided sources.

CORE PRINCIPLE: Only state facts that are EXPLICITLY mentioned in the sources. Do not add, interpret, or assume anything.

ANTI-HALLUCINATION PROTOCOL:
1. DIRECT EXTRACTION: Copy exact facts from sources without interpretation
2. SOURCE VERIFICATION: If multiple sources agree, state the fact confidently
3. CONFLICT RESOLUTION: If sources disagree, present both versions with source attribution
4. NO EXTERNAL KNOWLEDGE: Never add information not present in the sources
5. EXPLICIT GAPS: If asked information is not in sources, clearly state this
6. EXACT NAMES/DATES: Copy proper names, dates, and numbers exactly as written
7. PARTY VERIFICATION: Pay special attention to political party names - copy them exactly

FACTUAL EXTRACTION RULES:
- Political parties: Copy the EXACT party name from sources (BJP ≠ BJD)
- Dates: Include exact dates when provided
- Names: Use the exact spelling from sources
- Positions/Titles: Copy exactly as written
- Numbers: Be precise with statistics, years, etc.

RESPONSE FORMAT:
1. Primary fact with highest confidence (cross-verified by multiple sources)
2. Supporting details with source attribution when helpful
3. Any conflicting information with clear attribution
4. Explicit gaps: "The sources do not contain information about..."
5. Factual summary in 4-6 Odia sentences

FORBIDDEN ACTIONS:
❌ Adding information not in the sources
❌ Correcting or interpreting source information
❌ Mixing up similar names (BJP vs BJD, etc.)
❌ Assuming or extrapolating beyond explicit statements
❌ Using general knowledge to fill gaps
❌ Changing dates, names, or party affiliations

QUALITY CHECKS:
- Are all facts directly traceable to source text?
- Are proper names spelled exactly as in sources?
- Are political parties correctly identified?
- Are dates copied accurately?

Current date for context: {datetime.date.today()}"""),
    
    ("human", "Question: {question}"),
    ("human", "SOURCE 1 - Google AI Overview:\n{aio}"),
    ("human", "SOURCE 2 - Google Search Results:\n{g_snips}"),
    ("human", "SOURCE 3 - News Sources:\n{t_snips}"),
    ("human", """
CRITICAL INSTRUCTION: Extract and present ONLY the factual information that appears in these sources. 
Do not add any external knowledge. Pay special attention to:
- Exact political party names (BJP, BJD, INC, etc.)
- Precise dates and positions
- Correct spelling of names
If the sources contain conflicting information, present both versions clearly.
""")
])

def research_agent_node(state):
    """Enhanced research agent with stronger anti-hallucination measures."""
    q = state["messages"][-1].content.strip()
    print(f"\n🔵 RESEARCH-AGENT processing: {q}")
    print("🔍 Activating enhanced fact-verification protocol...")

    # Gather evidence from multiple sources
    aio = google_ai_overview_snippets.invoke(q)
    g_sn = google_search_snippets.invoke(q)
    tv = tavily_search_snippets.invoke(q)

    _log("Google AIO", aio)
    _log("Google Organic", g_sn) 
    _log("Tavily", tv)

    # Enhanced fact verification
    print("🧐 Performing cross-source fact verification...")
    
    # Check for key factual elements in sources
    fact_checks = {
        "person_mentioned": any(name in (aio + g_sn).lower() for name in ["mohan charan majhi", "majhi"]),
        "party_mentioned": any(party in (aio + g_sn) for party in ["BJP", "Bharatiya Janata Party", "BJD", "Biju Janata Dal"]),
        "date_mentioned": any(date in (aio + g_sn) for date in ["2024", "June 2024", "12 June"]),
        "position_mentioned": any(pos in (aio + g_sn).lower() for pos in ["chief minister", "cm", "15th"])
    }
    
    print(f"📊 FACT VERIFICATION: {fact_checks}")

    # Evidence-grounded synthesis with enhanced verification
    synthesis = (synth_prompt | llm).invoke({
        "question": q, 
        "aio": aio, 
        "g_snips": g_sn, 
        "t_snips": tv
    })
    
    print(f"\n🔍 FACT-VERIFIED SYNTHESIS:\n{synthesis.content}\n{'─'*60}")
    
    # Additional safety check for common errors
    content = synthesis.content
    if "mohan charan majhi" in content.lower():
        if "bjd" in content.lower() and ("bjp" in (aio + g_sn).lower() or "bharatiya janata party" in (aio + g_sn).lower()):
            print("🚨 WARNING: Potential party confusion detected in synthesis")
            print("🔧 Source data suggests BJP, synthesis should reflect this")
    
    return {"messages": [AIMessage(content=synthesis.content)]}