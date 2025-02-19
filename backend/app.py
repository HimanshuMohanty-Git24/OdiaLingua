import os
import uuid
import requests
import json
from typing import Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from duckduckgo_search import DDGS
from groq import Groq
from transformers import VitsModel, AutoTokenizer
import torch
import io
from fastapi.responses import StreamingResponse
import scipy.io.wavfile
import numpy as np
from fastapi import FastAPI, HTTPException, Request, Response

# Initialize TTS model and tokenizer
tts_model = None
tts_tokenizer = None

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


class TTSRequest(BaseModel):
    text: str


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
groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-specdec")
groq_client = Groq(api_key=GROQ_API_KEY)


def initialize_tts():
    global tts_model, tts_tokenizer
    if tts_model is None:
        tts_model = VitsModel.from_pretrained("facebook/mms-tts-ory")
        tts_tokenizer = AutoTokenizer.from_pretrained("facebook/mms-tts-ory")


def search_serpapi(query: str) -> Optional[str]:
    """Search using SerpAPI (Google)"""
    try:
        params = {
            "api_key": SERPAPI_KEY,
            "engine": "google",
            "q": query,
            "num": 5,
            "hl": "en",
            "gl": "in",
            "safe": "active"
        }
        response = requests.get(
            "https://serpapi.com/search.json", params=params, timeout=10)
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
    print("\n=== Search Query ===")
    print(f"Searching for: {query}")
    serp_results = search_serpapi(query)
    if serp_results:
        print("\n=== SerpAPI Results ===")
        print(serp_results)
        return serp_results
    ddg_results = search_duckduckgo(query)
    if ddg_results:
        print("\n=== DuckDuckGo Results ===")
        print(ddg_results)
        return ddg_results
    return "No search results available."


def build_system_prompt(search_results: str) -> str:
    prompt = (
        "You are OdiaLingua, an advanced Odia language AI assistant created by Himanshu Mohanty.\n"
        "ଆପଣ ଏକ ଉନ୍ନତ ଓଡ଼ିଆ ଭାଷା AI ସହାୟକ।\n\n"
        "ନିର୍ଦ୍ଦେଶାବଳୀ:\n"
        "1. ବିସ୍ତୃତ ଏବଂ ସମ୍ପୂର୍ଣ୍ଣ ଉତ୍ତର ଦିଅନ୍ତୁ।\n"
        "2. ପ୍ରତ୍ୟେକ ଉତ୍ତର ଅତି କମରେ ୪-୫ ବାକ୍ୟ ହେବା ଆବଶ୍ୟକ।\n"
        "3. ବିଷୟ ବସ୍ତୁକୁ ବିସ୍ତୃତ ଭାବରେ ବର୍ଣ୍ଣନା କରନ୍ତୁ।\n"
        "4. ଇଂରାଜୀ ଶବ୍ଦ ଯଥା ସ୍ଥାନରେ ବ୍ୟବହାର କରନ୍ତୁ।\n"
        "5. ଉତ୍ତର ଶେଷରେ ଏକ ସାରାଂଶ ଦିଅନ୍ତୁ।\n"
        "6. ଯଦି ପ୍ରଶ୍ନର ଉତ୍ତର ଜଣା ନାହିଁ, ତେବେ ସେ ବିଷୟରେ ସ୍ପଷ୍ଟ କରନ୍ତୁ।\n\n"
        "ସାମ୍ପ୍ରତିକ ତଥ୍ୟ:\n"
        "===================\n"
        f"{search_results}\n"
        "===================\n"
        "Use the search result only if necessary or you don't know the information.\n"
        "Always give the answer in concise and complete form.\n"
        "Always give summarized answers within 2-3 sentences.\n"
        "ମନେ ରଖନ୍ତୁ: ସବୁ ଉତ୍ତର ବିସ୍ତୃତ ଏବଂ ସମ୍ପୂର୍ଣ୍ଣ ହେବା ଆବଶ୍ୟକ।"
    )
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

        # Build conversation history with explicit length handling
        conversation = [{"role": "system", "content": system_prompt}]

        # Only include last 10 messages to prevent context overflow
        recent_messages = sessions[session_id]["messages"][-10:
                                                           ] if sessions[session_id]["messages"] else []
        conversation.extend(recent_messages)
        conversation.append(latest_message)

        try:
            chat_completion = groq_client.chat.completions.create(
                messages=conversation,
                model=groq_model,
                max_tokens=8192,
                temperature=0.7,
                top_p=0.9,
                stop=None,
                presence_penalty=0.3,
                frequency_penalty=0.3,
            )

            assistant_response = chat_completion.choices[0].message.content.strip(
            )
            print(f"Assistant Response: {assistant_response}")

            # Validate response length and content
            if len(assistant_response) < 50:  # Minimum response length
                assistant_response = (
                    "ମୁଁ କ୍ଷମା ପ୍ରାର୍ଥନା କରୁଛି, ମୁଁ ଆପଣଙ୍କ ପ୍ରଶ୍ନର ଉତ୍ତର ଦେବାକୁ ଅସମର୍ଥ। "
                    "ଦୟାକରି ପୁନଃ ପ୍ରଶ୍ନ କରନ୍ତୁ।"
                )

            # Store messages in session
            sessions[session_id]["messages"].append(latest_message)
            sessions[session_id]["messages"].append({
                "role": "assistant",
                "content": assistant_response
            })

            return StreamChatResponse(status="success", response=assistant_response)

        except Exception as e:
            print(f"\n=== Groq API Error ===\n{str(e)}")
            raise HTTPException(
                status_code=500, detail=f"Error generating response: {str(e)}")

    except Exception as e:
        print(f"\n=== Stream Chat Error ===\n{str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/text-to-speech")
async def text_to_speech(request: TTSRequest):
    try:
        initialize_tts()
        
        # Preprocess text to ensure proper Odia handling
        text = request.text.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Empty text provided")

        # Generate speech with proper error handling
        try:
            inputs = tts_tokenizer(text, return_tensors="pt")
            
            with torch.no_grad():
                output = tts_model(**inputs).waveform

            # Ensure proper audio format and sampling
            audio_data = output.numpy().squeeze()
            if len(audio_data.shape) != 1:
                audio_data = audio_data.mean(axis=0)

            # Convert to WAV format with proper sampling rate
            buffer = io.BytesIO()
            scipy.io.wavfile.write(
                buffer, 
                rate=tts_model.config.sampling_rate, 
                data=audio_data.astype(np.float32)
            )
            buffer.seek(0)
            
            return StreamingResponse(
                buffer, 
                media_type="audio/wav",
                headers={
                    "Content-Type": "audio/wav",
                    "Content-Disposition": "attachment;filename=speech.wav"
                }
            )
        
        except torch.cuda.OutOfMemoryError:
            raise HTTPException(status_code=507, detail="GPU memory insufficient for TTS generation")
        
        except Exception as e:
            print(f"TTS generation error: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to generate speech")
    
    except Exception as e:
        print(f"TTS error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/clear-history", response_model=ClearHistoryResponse)
async def clear_history(request: ClearHistoryRequest):
    try:
        session_id = request.session_id
        if session_id not in sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        sessions[session_id]["messages"] = []
        return ClearHistoryResponse(status="success", message="Chat history cleared successfully")
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Clear history error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
