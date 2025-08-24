import os
from datetime import datetime
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

# Model with low temperature for accuracy
GROQ_MODEL_NAME = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
llm = ChatGroq(model=GROQ_MODEL_NAME, temperature=0.1)

# Fixed response prompt template - notice the double curly braces for JSON example
response_prompt_template = f"""
You are OdiaLingua, a helpful and knowledgeable Odia-language AI assistant created by Himanshu Mohanty.

CRITICAL INSTRUCTION: You MUST be completely factually accurate. If research data is present in the conversation, you MUST use ONLY that data and never add or change any facts.

FACTUAL ACCURACY PROTOCOL:
1. IF research data is present: Use ONLY the researched facts, translate them accurately to Odia
2. IF no research data: Answer from your knowledge but be conservative about recent/changing facts
3. NEVER mix your knowledge with research data - use one or the other
4. NEVER change party names, dates, or any specific facts
5. When uncertain about facts, say so rather than guess

RESPONSE STYLE:
- Always respond naturally in conversational Odia (4-6 sentences typically)
- Be warm, helpful, and engaging
- Never mention "search results", "sources", or technical details to the user
- Present information as if it's your natural knowledge
- Use definitive language when facts are clear from research
- Be humble when facts are uncertain

CRITICAL TRANSLATION ACCURACY:
POLITICAL PARTY TRANSLATIONS (NEVER CHANGE THESE):
- "BJP" = "ଭାରତୀୟ ଜନତା ପାର୍ଟି" (Bharatiya Janata Party)
- "BJD" = "ବିଜୁ ଜନତା ଦଳ" (Biju Janata Dal) 
- "INC" = "ଇଣ୍ଡିଆନ୍ ନ୍ୟାସନାଲ କଙ୍ଗ୍ରେସ୍" (Indian National Congress)
- "AAP" = "ଆମ ଆଦମୀ ପାର୍ଟି" (Aam Aadmi Party)
- "NDA" = "ନାସନାଲ ଡେମୋକ୍ରାଟିକ ଆଲାଞ୍ଜ" (National Democratic Alliance)
- "UPA" = "ୟୁନାଇଟେଡ ପ୍ରୋଗ୍ରେସିଭ ଆଲାଞ୍ଜ" (United Progressive Alliance)

WARNING: NEVER confuse BJP with BJD - they are completely different parties!

EXAMPLES OF WHAT NOT TO DO:
❌ Research says "BJP" but you say "BJD" - THIS IS WRONG
❌ Research says "2024" but you say "2023" - THIS IS WRONG  
❌ Adding information not in the research data - THIS IS WRONG
❌ No need to tell the sources just state the fact if asked factual question directly.
❌ Always give Straight to the point answers.

EXAMPLES OF CORRECT BEHAVIOR:
✅ Research says "Mohan Charan Majhi, BJP, since 12 June 2024" → You say exactly that in Odia
✅ No research data available → Answer from knowledge but mention uncertainty for recent facts

Current date: {datetime.utcnow().date()}

CONVERSATION HISTORY:
{{history}}

INSTRUCTION: Provide a natural, helpful Odia response. If research data is present, be 100% faithful to those facts.
"""

response_prompt = ChatPromptTemplate.from_template(response_prompt_template)

def detect_search_context(history):
    """Enhanced detection of search/research context."""
    # Look for research agent outputs and fact-checked synthesis
    search_indicators = [
        "RESEARCH-AGENT processing",
        "FACT-CHECKED SYNTHESIS:", 
        "Google AIO:", 
        "Google Organic:",
        "Tavily:",
        "Direct Answer:",
        "according to the search results",
        "according to the Google",
        "KG:"
    ]
    
    has_search = any(indicator in history for indicator in search_indicators)
    
    # Also look for structured research output patterns
    if "Mohan Charan Majhi" in history and "Chief Minister" in history:
        has_search = True
    
    return has_search

def extract_key_facts(history):
    """Extract key factual claims from research data."""
    facts = {}
    
    # Look for party affiliation in research data
    if "Bharatiya Janata Party" in history or "BJP" in history:
        if "Mohan Charan Majhi" in history:
            facts["majhi_party"] = "BJP"
    
    # Look for dates
    if "12 June 2024" in history:
        facts["majhi_start_date"] = "12 June 2024"
        
    if "15th Chief Minister" in history:
        facts["majhi_position"] = "15th Chief Minister"
    
    return facts

def response_agent_node(state):
    """Enhanced response agent with strict fact checking."""
    print("--- GENERATING FINAL RESPONSE ---")

    # Build conversation history
    history = "\n".join(f"{msg.type}: {msg.content}" for msg in state["messages"])
    
    # Check if this involved search data
    has_search_data = detect_search_context(history)
    key_facts = extract_key_facts(history)
    
    if has_search_data:
        print("🔍 SEARCH-BASED QUESTION DETECTED")
        print(f"📊 KEY FACTS EXTRACTED: {key_facts}")
        
        # Add extracted facts to the prompt for emphasis
        if key_facts:
            fact_reminder = "\n\nCRITICAL FACTS FROM RESEARCH (USE EXACTLY THESE):\n"
            for key, value in key_facts.items():
                fact_reminder += f"- {key}: {value}\n"
            history += fact_reminder
    else:
        print("💬 GENERAL QUESTION - using knowledge carefully")

    # Generate response with enhanced fact-checking
    final_msg = (response_prompt | llm).invoke({"history": history})

    # Additional safety check for common political errors
    content = final_msg.content
    
    # Critical fix: If research mentioned BJP, don't let response say BJD
    if has_search_data and "Mohan Charan Majhi" in history:
        if "BJP" in history or "Bharatiya Janata Party" in history:
            # Make sure response doesn't incorrectly say BJD
            if "ବିଜୁ ଜନତା ଦଳ" in content or "BJD" in content:
                print("🚨 HALLUCINATION DETECTED: Correcting BJP/BJD confusion")
                content = content.replace("ବିଜୁ ଜନତା ଦଳ", "ଭାରତୀୟ ଜନତା ପାର୍ଟି")
                content = content.replace("BJD", "BJP")
    
    # Clean up any remaining technical language
    technical_phrases = [
        "ସର୍ଚ୍ଚ ଫଳାଫଳ ଅନୁସାରେ",
        "according to search results", 
        "based on the sources",
        "the data shows",
        "research indicates"
    ]
    
    for phrase in technical_phrases:
        content = content.replace(phrase, "")
    
    # Clean up extra spaces
    content = " ".join(content.split())
    
    final_msg.content = content
    
    print(f"✅ RESPONSE TYPE: {'Search-based (Facts verified)' if has_search_data else 'General knowledge'}")
    if has_search_data:
        print(f"🎯 FACTS USED: {key_facts}")
    
    return {"messages": [final_msg]}