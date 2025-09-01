import os
import uuid
import json
import tempfile
import logging
import io
from fastapi import FastAPI, HTTPException, Request, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse, JSONResponse
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID
from appwrite.permission import Permission
from appwrite.role import Role
from langchain_core.messages import HumanMessage, AIMessage

# Configure logger
logger = logging.getLogger("OdiaLinguaBackend")
logging.basicConfig(level=logging.INFO)

# Load environment variables
load_dotenv()

# Local imports
from graph import graph
from services.tts_service import generate_odia_speech
from services.stt_service import transcribe_audio, is_supported_audio_format
from agents.title_agent import generate_chat_title

# Initialize FastAPI App
app = FastAPI(title="OdiaLingua Agentic Backend")

# CORS MIDDLEWARE
origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5000")
origins = [origin.strip() for origin in origins_str.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Appwrite Client Initialization
def get_appwrite_client():
    client = Client()
    client.set_endpoint(os.getenv("APPWRITE_ENDPOINT"))
    client.set_project(os.getenv("APPWRITE_PROJECT_ID"))
    client.set_key(os.getenv("APPWRITE_API_KEY"))
    return client

def get_db(client: Client = Depends(get_appwrite_client)):
    return Databases(client)

# Pydantic Models
class ChatRequest(BaseModel):
    session_id: str
    message: str
    user_id: str
    is_new_chat: bool # Flag from frontend to indicate a new chat

class TTSRequest(BaseModel):
    text: str

class SessionActionRequest(BaseModel):
    session_id: str

class RenameRequest(BaseModel):
    session_id: str
    name: str

# Helper to format message history for LangGraph
def format_history(messages_list: list) -> list:
    return [
        HumanMessage(content=msg['content']) if msg['role'] == 'user'
        else AIMessage(content=msg['content'])
        for msg in messages_list
    ]

# --- API Endpoints ---

@app.get("/")
async def root():
    """A simple health check endpoint."""
    return {"status": "ok", "message": "OdiaLingua Agentic Backend is running."}

@app.get("/chats/{user_id}")
async def get_user_chats(user_id: str, db: Databases = Depends(get_db)):
    """Fetches all chat sessions for a given user."""
    try:
        from appwrite.query import Query
        db_id = os.getenv("APPWRITE_DATABASE_ID")
        collection_id = os.getenv("APPWRITE_COLLECTION_ID")
        response = db.list_documents(
            db_id,
            collection_id,
            queries=[Query.equal("userId", user_id)]
        )

        chats = []
        for doc in response['documents']:
            messages = json.loads(doc.get('messages', '[]'))
            chats.append({
                "id": doc['$id'],
                "name": doc['name'],
                "messages": messages
            })
        return chats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: ChatRequest, db: Databases = Depends(get_db)):
    """Main chat endpoint. Handles new chat creation, titling, and conversation."""
    session_id = request.session_id
    user_id = request.user_id
    user_message = request.message
    db_id = os.getenv("APPWRITE_DATABASE_ID")
    collection_id = os.getenv("APPWRITE_COLLECTION_ID")
    messages_history = []
    new_title = None

    if request.is_new_chat:
        # Create new document for the chat
        doc_data = {'userId': user_id, 'sessionId': session_id, 'name': 'New Chat', 'messages': '[]'}
        permissions = [Permission.read(Role.user(user_id)), Permission.update(Role.user(user_id)), Permission.delete(Role.user(user_id))]
        db.create_document(db_id, collection_id, session_id, doc_data, permissions)
    else:
        # Fetch existing history
        try:
            doc = db.get_document(db_id, collection_id, session_id)
            messages_history = json.loads(doc.get('messages', '[]'))
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Chat session not found: {session_id}")

    messages_history.append({"role": "user", "content": user_message})
    formatted_messages = format_history(messages_history)
    initial_state = {"messages": formatted_messages}
    final_state = await graph.ainvoke(initial_state)
    assistant_response = final_state["messages"][-1].content
    messages_history.append({"role": "assistant", "content": assistant_response})
    update_data = {'messages': json.dumps(messages_history)}

    # If it was a new chat, generate and set the title
    if request.is_new_chat:
        new_title = generate_chat_title(user_message)
        update_data['name'] = new_title

    db.update_document(db_id, collection_id, session_id, update_data)
    return {"status": "success", "response": assistant_response, "newName": new_title}

@app.post("/clear-history")
async def clear_history(request: SessionActionRequest, db: Databases = Depends(get_db)):
    """Clears the message history for a given session."""
    try:
        db.update_document(
            database_id=os.getenv("APPWRITE_DATABASE_ID"),
            collection_id=os.getenv("APPWRITE_COLLECTION_ID"),
            document_id=request.session_id,
            data={'messages': '[]'}
        )
        return {"status": "success", "message": "Chat history cleared"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Session not found: {str(e)}")

@app.post("/delete-chat")
async def delete_chat(request: SessionActionRequest, db: Databases = Depends(get_db)):
    """Deletes a chat session document."""
    try:
        db.delete_document(
            database_id=os.getenv("APPWRITE_DATABASE_ID"),
            collection_id=os.getenv("APPWRITE_COLLECTION_ID"),
            document_id=request.session_id
        )
        return {"status": "success", "message": "Chat session deleted"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Session not found: {str(e)}")

@app.post("/rename-chat")
async def rename_chat(request: RenameRequest, db: Databases = Depends(get_db)):
    """Renames a chat session."""
    try:
        db.update_document(
            database_id=os.getenv("APPWRITE_DATABASE_ID"),
            collection_id=os.getenv("APPWRITE_COLLECTION_ID"),
            document_id=request.session_id,
            data={'name': request.name}
        )
        return {"status": "success", "message": "Chat renamed"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Session not found: {str(e)}")

@app.post("/text-to-speech")
async def text_to_speech(request: TTSRequest):
    try:
        text = request.text.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Empty text provided")
        audio_content = await generate_odia_speech(text)
        return StreamingResponse(iter([audio_content]), media_type="audio/wav")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/speech-to-text")
async def speech_to_text(audio: UploadFile = File(...)):
    """
    Convert speech to text using Sarvam AI's Saarika model
    with automatic language detection for Odia/English/Hindi speakers.
    """
    try:
        logger.info(f"Received STT request for file: {audio.filename}")
        logger.info(f"Content type: {audio.content_type}")
        
        # Validate file
        if not audio.filename:
            logger.error("No filename provided")
            raise HTTPException(status_code=400, detail="No file provided")
        
        if not is_supported_audio_format(audio.filename):
            logger.error(f"Unsupported format: {audio.filename}")
            raise HTTPException(
                status_code=400,
                detail="Unsupported audio format. Please use supported formats."
            )

        # Read the uploaded audio file
        audio_content = await audio.read()
        logger.info(f"Audio file size: {len(audio_content)} bytes")
        
        if len(audio_content) == 0:
            logger.error("Empty audio file received")
            raise HTTPException(status_code=400, detail="Empty audio file")

        # Check file size limit
        max_size = 10 * 1024 * 1024  # 10MB limit for safety
        if len(audio_content) > max_size:
            logger.error(f"File too large: {len(audio_content)} bytes")
            raise HTTPException(status_code=400, detail="Audio file too large. Maximum size is 10MB")

        # Create a temporary file-like object
        audio_file = io.BytesIO(audio_content)
        
        # Transcribe using Sarvam AI
        result = await transcribe_audio(audio_file, language_code="unknown")
        
        logger.info(f"Transcription successful: {result}")
        return {
            "success": True,
            "transcript": result["transcript"],
            "detected_language": result["detected_language"],
            "message": "Speech transcribed successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in STT endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
