from typing import TypedDict, Annotated, List
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

# Agents
from agents.router import get_route
from agents.research_agent import research_agent_node
from agents.weather_agent import weather_agent_node
from agents.response_agent import response_agent_node

# Tools
from tools.search_tools import (
    google_ai_overview_snippets,
    google_search_snippets,
    tavily_search_snippets,
)
from tools.weather_tool import get_current_weather

# ── Conversation state ───────────────────────────────────────────
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], lambda x, y: x + y]
    next_agent: str            # set by router

# ── Tool node (only weather uses tools via LLM) ──────────────────
tools = [
    google_ai_overview_snippets,
    google_search_snippets,
    tavily_search_snippets,
    get_current_weather,
]
tool_node = ToolNode(tools)

# ── Build the LangGraph workflow ─────────────────────────────────
workflow = StateGraph(AgentState)

workflow.add_node("router",   get_route)
workflow.add_node("research", research_agent_node)
workflow.add_node("weather",  weather_agent_node)
workflow.add_node("tool_node", tool_node)
workflow.add_node("response", response_agent_node)

workflow.set_entry_point("router")

def _route(state: AgentState) -> str:
    return state.get("next_agent", "response")

workflow.add_conditional_edges(
    "router",
    _route,
    {
        "research": "research",
        "weather":  "weather",
        "response": "response",
    },
)

workflow.add_edge("research",  "tool_node")
workflow.add_edge("weather",   "tool_node")
workflow.add_edge("tool_node", "response")
workflow.add_edge("response",  END)

graph = workflow.compile()
