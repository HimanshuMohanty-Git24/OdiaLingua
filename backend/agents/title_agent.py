import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

# Use a model good for summarization, can be different from the main one if needed
GROQ_MODEL_NAME = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
llm = ChatGroq(model=GROQ_MODEL_NAME, temperature=0)

title_prompt_template = """
Based on the following first user message in a conversation, create a very short, descriptive title in the Odia language.
The title should be 3-5 words long and capture the main topic of the message.

Examples:
Message: "ଓଡ଼ିଶାର ବର୍ତ୍ତମାନର ମୁଖ୍ୟମନ୍ତ୍ରୀ କିଏ?"
Title: "ଓଡ଼ିଶାର ମୁଖ୍ୟମନ୍ତ୍ରୀ"

Message: "ଭୁବନେଶ୍ୱରରେ ପାଗ କିପରି ଅଛି?"
Title: "ଭୁବନେଶ୍ୱର ପାଗ"

Message: "ମୋତେ ଏକ କବିତା ଲେଖି ଦିଅ"
Title: "ଏକ ସୁନ୍ଦର କବିତା"

User Message: "{user_message}"
Title:
"""

title_prompt = ChatPromptTemplate.from_template(title_prompt_template)
title_generation_chain = title_prompt | llm

def generate_chat_title(first_user_message: str) -> str:
    """Generates a descriptive title for a new chat in Odia."""
    print("--- CALLING TITLE AGENT ---")
    try:
        title = title_generation_chain.invoke({"user_message": first_user_message})
        # The response from the LLM might include extra text or quotes, so we clean it.
        cleaned_title = title.content.strip().replace('"', '')
        print(f"--- GENERATED TITLE: {cleaned_title} ---")
        return cleaned_title
    except Exception as e:
        print(f"Error generating title: {e}")
        return "New Chat"