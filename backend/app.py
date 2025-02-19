import os
import uuid
import requests
from typing import Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from duckduckgo_search import DDGS
from groq import Groq
import json

load_dotenv()

app = FastAPI(title="OdiaLingua ChatBot Backend")

# Allow CORS
origins = [
    "http://localhost:5173",
    "http://localhost:5000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for sessions
sessions = {}

# Pydantic models
class SessionCreateResponse(BaseModel):
    status: str
    session_id: str

class ChatMessage(BaseModel):
    role: str
    content: str

class StreamChatRequest(BaseModel):
    session_id: str
    messages: list[ChatMessage]

class StreamChatResponse(BaseModel):
    status: str
    response: str

class ClearHistoryRequest(BaseModel):
    session_id: str

class ClearHistoryResponse(BaseModel):
    status: str
    message: str

# Initialize clients
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")
groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
groq_client = Groq(api_key=GROQ_API_KEY)

def search_serpapi(query: str) -> Optional[str]:
    """Search using SerpAPI"""
    try:
        params = {
            "api_key": SERPAPI_KEY,
            "engine": "google",
            "q": f"{query} site:.in",
            "num": 5,
            "hl": "en",
            "gl": "in",
            "safe": "active"
        }
        
        response = requests.get(
            "https://serpapi.com/search.json",
            params=params,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            organic_results = data.get("organic_results", [])
            
            if not organic_results:
                return None
                
            summary = ""
            for i, result in enumerate(organic_results[:3], 1):
                title = result.get("title", "")
                snippet = result.get("snippet", "")
                summary += f"{i}. {title}: {snippet}\n\n"
            
            return summary.strip() if summary else None
    except Exception as e:
        print(f"SerpAPI error: {str(e)}")
        return None

def search_duckduckgo(query: str) -> Optional[str]:
    """Search using DuckDuckGo"""
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=3))
            
            summary = ""
            for i, result in enumerate(results, 1):
                title = result.get("title", "")
                snippet = result.get("body", "")
                summary += f"{i}. {title}: {snippet}\n\n"
                
            return summary[:500] if summary else None
    except Exception as e:
        print(f"DuckDuckGo error: {str(e)}")
        return None

def search_combined(query: str) -> str:
    """Combined search using SerpAPI and DuckDuckGo"""
    try:
        print("\n=== Search Query ===")
        print(f"Searching for: {query}")
        
        # Try SerpAPI first
        serp_results = search_serpapi(query)
        if serp_results:
            print("\n=== SerpAPI Results ===")
            print(serp_results)
            return serp_results
        
        # Fallback to DuckDuckGo
        ddg_results = search_duckduckgo(query)
        if ddg_results:
            print("\n=== DuckDuckGo Results ===")
            print(ddg_results)
            return ddg_results
            
        return "No search results available."
    except Exception as e:
        print(f"\n=== Search Error ===\n{str(e)}")
        return "No search results available."

def build_system_prompt(search_results: str) -> str:
    prompt = (
        "You are a OdiaLingua First ever odia Chatbot made by Himanshu Mohanty.\n"
        "ଆପଣ ଏକ ଓଡ଼ିଆ ଭାଷା ବାର୍ତ୍ତାଳାପ AI ସହାୟକ। \n"
        "ନିମ୍ନଲିଖିତ ନିର୍ଦ୍ଦେଶାବଳୀ ଅନୁସରଣ କରନ୍ତୁ:\n\n"
        "1. ଆପଣଙ୍କର ଉତ୍ତର ସଂକ୍ଷିପ୍ତ ଏବଂ ସଠିକ ହେବା ଉଚିତ।\n"
        "2. ଉତ୍ତର ଅତି କମରେ ୨-୩ ବାକ୍ୟ ପୂର୍ଣ୍ଣ ହେବା ଆବଶ୍ୟକ।\n"
        "3. ଅସମ୍ପୂର୍ଣ୍ଣ ଉତ୍ତର କଦାପି ଦିଅନ୍ତୁ ନାହିଁ।\n"
        "4. ବାକ୍ୟ ମଝିରେ ଅଟକନ୍ତୁ ନାହିଁ - ପ୍ରତ୍ୟେକ ବାକ୍ୟ ସମ୍ପୂର୍ଣ୍ଣ ହେବା ଆବଶ୍ୟକ।\n"
        "5. ଇଂରାଜୀ ଶବ୍ଦ ଯେପରି AI, ML, ChatGPT ଇତ୍ୟାଦି ଇଂରାଜୀରେ ହିଁ ଲେଖନ୍ତୁ।\n\n"
        "ନିମ୍ନଲିଖିତ ସାମ୍ପ୍ରତିକ ତଥ୍ୟ ଆଧାରରେ ଉତ୍ତର ଦିଅନ୍ତୁ:\n"
        "===================\n"
        f"{search_results}\n"
        "===================\n"
        "ସର୍ବଦା ମନେ ରଖନ୍ତୁ:\n"
        "- ପ୍ରତ୍ୟେକ ଉତ୍ତର ସମ୍ପୂର୍ଣ୍ଣ ବାକ୍ୟରେ ଶେଷ ହେବା ଆବଶ୍ୟକ\n"
        "- ଅର୍ଦ୍ଧ ସମାପ୍ତ ବାକ୍ୟ ଗ୍ରହଣୀୟ ନୁହେଁ\n"
        "- ପ୍ରତ୍ୟେକ ଉତ୍ତର ଏକ ପୂର୍ଣ୍ଣଛେଦ (।) ସହ ଶେଷ ହେବା ଆବଶ୍ୟକ\n"
    )
    print("\n=== System Prompt ===")
    print(prompt)
    return prompt

@app.post("/create-session", response_model=SessionCreateResponse)
async def create_session():
    session_id = str(uuid.uuid4())
    sessions[session_id] = {"messages": []}
    return SessionCreateResponse(status="success", session_id=session_id)

@app.post("/stream-chat", response_model=StreamChatResponse)
async def stream_chat(request: StreamChatRequest):
    try:
        session_id = request.session_id
        if session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Get user's message and update session
        latest_message = request.messages[-1].dict()
        user_latest = latest_message["content"]
        
        print("\n=== New Chat Request ===")
        print(f"Session ID: {session_id}")
        print(f"User Message: {user_latest}")
        
        # Perform search and build prompt
        search_results = search_combined(user_latest)
        system_prompt = build_system_prompt(search_results)
        
        # Build conversation history
        conversation = [{"role": "system", "content": system_prompt}]
        conversation.extend(sessions[session_id]["messages"])
        conversation.append(latest_message)
        
        print("\n=== Request to Groq ===")
        print(json.dumps(conversation, ensure_ascii=False, indent=2))
        
        print("\n=== Full Conversation ===")
        for msg in conversation:
            print(f"{msg['role']}: {msg['content'][:100]}...")
        
        try:
            chat_completion = groq_client.chat.completions.create(
                messages=conversation,
                model=groq_model,
                max_tokens=8192,  # Increased from 4096
                temperature=0.5,  # Reduced from 0.7 for more focused responses
                top_p=0.9,
                stop=["।", "\n"],  # Stop at Odia full stop or newline
                presence_penalty=0.1,  # Slight penalty to avoid repetition
                frequency_penalty=0.1,  # Slight penalty to encourage diverse responses
            )
            assistant_response = chat_completion.choices[0].message.content.strip()
            
            # Validate response completeness
            if len(assistant_response) < 20:  # Increased minimum length
                raise Exception("Response too short - likely truncated")
            
            if not any(assistant_response.endswith(end) for end in ["।", ".", "!", "?"]):
                assistant_response += "।"  # Add Odia full stop if missing
            
            print("\n=== Response Details ===")
            print(f"Response length: {len(assistant_response)} characters")
            print(f"Response: {assistant_response}")
            
            # Update session with the new messages
            sessions[session_id]["messages"].append(latest_message)
            sessions[session_id]["messages"].append({
                "role": "assistant", 
                "content": assistant_response
            })
            
            return StreamChatResponse(status="success", response=assistant_response)
            
        except Exception as e:
            print(f"\n=== Groq API Error ===\n{str(e)}")
            raise HTTPException(
                status_code=500, 
                detail=f"Error generating response: {str(e)}"
            )
            
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"\n=== Stream Chat Error ===\n{str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clear-history", response_model=ClearHistoryResponse)
async def clear_history(request: ClearHistoryRequest):
    try:
        session_id = request.session_id
        if session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        sessions[session_id]["messages"] = []
        return ClearHistoryResponse(
            status="success", 
            message="Chat history cleared successfully"
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Clear history error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)