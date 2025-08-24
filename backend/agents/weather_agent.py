import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from tools.weather_tool import get_current_weather

# Use the model from the environment variable
GROQ_MODEL_NAME = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
llm = ChatGroq(model=GROQ_MODEL_NAME, temperature=0)
tools = [get_current_weather]
llm_with_tools = llm.bind_tools(tools)

weather_agent_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a weather assistant. Use the get_current_weather tool to find the weather for the location mentioned in the user's message."),
        ("human", "{user_message}"),
    ]
)

def weather_agent_node(state):
    """The node for the weather agent. It invokes the LLM with the weather tool."""
    print("--- CALLING WEATHER AGENT ---")
    user_message = state["messages"][-1].content
    
    chain = weather_agent_prompt | llm_with_tools
    result = chain.invoke({"user_message": user_message})

    # Return proper state update format
    return {"messages": [result]}
