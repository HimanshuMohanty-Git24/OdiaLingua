import os, json, re, requests, datetime
from typing import List
from langchain_core.tools import tool
from googletrans import Translator           # pip install googletrans==4.0.0-rc1
import serpapi  # New import style
import asyncio

# ── API keys ──────────────────────────────────────────────────────
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
TAVILY_API_KEY  = os.getenv("TAVILY_API_KEY")

translator = Translator()

# ── Helpers ───────────────────────────────────────────────────────
def _dbg(tag, obj):
    try:
        txt = json.dumps(obj, indent=2, ensure_ascii=False)[:1600]
    except TypeError:
        txt = str(obj)[:1600]
    print(f"\n🟡 DEBUG {tag}:\n{txt}\n{'─'*60}")

async def _ensure_english_async(q: str) -> str:
    """Async translate to English if the query is not mostly Latin characters."""
    if re.fullmatch(r"[A-Za-z0-9 ,.'\"?%:-]+", q):
        return q
    
    # Use await instead of asyncio.run()
    result = await translator.translate(q, dest="en")
    return result.text

def _filter_recent(snips: List[str], yr_cutoff=2023) -> List[str]:
    out=[]
    for s in snips:
        m=re.search(r"(19|20)\\d{2}", s)
        if not m or int(m.group())>=yr_cutoff:
            out.append(s)
    return out or snips

def _extract_ai_overview(ai_block: dict) -> str:
    """Flatten Google AI-Overview text_blocks into one string."""
    out=[]
    for blk in ai_block.get("text_blocks", []):
        t=blk.get("snippet") or blk.get("title")
        if t: out.append(t)
        # list/expandable inner blocks
        if blk.get("list"):
            for itm in blk["list"]:
                out.append(itm.get("snippet") or itm.get("title",""))
        if blk.get("text_blocks"):
            for tb in blk["text_blocks"]:
                if tb.get("snippet"):
                    out.append(tb["snippet"])
    return "\\n".join(out)

# ── Google AI-Overview primary tool ───────────────────────────────
@tool
async def google_ai_overview_snippets(query: str) -> str:
    """
    Return up-to-date snippets from Google AI Overview.
    Falls back to answer-box / knowledge graph / organic snippets.
    """
    q_en = await _ensure_english_async(query)
    _dbg("google_ai_overview_snippets → query", q_en)

    if not SERPAPI_API_KEY:
        return "AIO: API key missing"

    try:
        # 1️⃣ initial Google Search (no_cache for fresh page_token)
        base_params = {
            "engine": "google",
            "q": q_en,
            "hl": "en",
            "gl": "in",
            "no_cache": "true",
            "api_key": SERPAPI_API_KEY,
        }
        # Updated usage for new serpapi package
        res: dict = serpapi.search(base_params)
        _dbg("google_ai_overview → first_response.ai_overview", res.get("ai_overview"))

        ai = res.get("ai_overview")
        # direct AI text
        if ai and ai.get("text_blocks"):
            return "AIO: " + _extract_ai_overview(ai)[:900]

        # 2️⃣ fetch via page_token if required
        page_token = ai.get("page_token") if ai else None
        if page_token:
            token_params = {
                "engine": "google_ai_overview",
                "page_token": page_token,
                "api_key": SERPAPI_API_KEY,
                "no_cache": "true",
            }
            # Updated usage for new serpapi package
            res2: dict = serpapi.search(token_params)
            _dbg("google_ai_overview → token_response.ai_overview", res2.get("ai_overview"))
            ai2 = res2.get("ai_overview")
            if ai2 and ai2.get("text_blocks"):
                return "AIO: " + _extract_ai_overview(ai2)[:900]

        # 3️⃣ fallback paths
        if res.get("answer_box", {}).get("snippet"):
            return "Direct Answer: " + res["answer_box"]["snippet"]

        kg = res.get("knowledge_graph")
        if kg and kg.get("title"):
            return f"KG: {kg['title']} – {kg.get('type','')}"

        # last resort: organic snippet
        org = res.get("organic_results", [])
        if org and org[0].get("snippet"):
            return org[0]["title"] + ": " + org[0]["snippet"]

        return "Google search produced no useful snippet"
    except Exception as e:
        return f"AIO error: {e}"

# ── Standard Google fallback (organic / overview) ─────────────────
@tool
async def google_search_snippets(query: str) -> str:
    """
    Search Google for organic results and return snippets.
    Falls back to standard search results when AI Overview is not available.
    """
    q_en = await _ensure_english_async(query)
    _dbg("google_search → query", q_en)

    if not SERPAPI_API_KEY:
        return "Google: API key missing"

    try:
        params = {
            "engine":"google","q":q_en,"hl":"en","gl":"in","num":10,
            "api_key":SERPAPI_API_KEY
        }
        # Updated usage for new serpapi package
        res: dict = serpapi.search(params)
        _dbg("google_search → raw", res)

        snips=[r["snippet"] for r in res.get("organic_results",[]) if r.get("snippet")]
        snips=_filter_recent(snips)[:3]
        return "\\n".join(snips) if snips else "Google: no useful snippet"
    except Exception as e:
        return f"Google error: {e}"

# ── Tavily snippets (news) ────────────────────────────────────────
@tool
async def tavily_search_snippets(query: str) -> str:
    """
    Search Tavily API for news-focused results and return content snippets.
    Specialized for current events and recent news articles.
    """
    q_en = await _ensure_english_async(query)
    _dbg("tavily_search → query", q_en)

    if not TAVILY_API_KEY:
        return "Tavily: API key missing"

    try:
        data=requests.post(
            "https://api.tavily.com/search",
            headers={"Authorization":f"Bearer {TAVILY_API_KEY}",
                     "Content-Type":"application/json"},
            json={"query":q_en,"topic":"news","search_depth":"advanced",
                  "max_results":15,"include_answer":False},
            timeout=20).json()
        _dbg("tavily_search → raw", data)

        snips=[f"{r['title']}: {r.get('content','')}"
               for r in data.get("results",[]) if r.get("content")]
        snips=_filter_recent(snips)[:3]
        return "\\n".join(snips) if snips else "Tavily: no useful snippet"
    except Exception as e:
        return f"Tavily error: {e}"