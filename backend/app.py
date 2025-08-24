import os
import uuid
import json  # Add this import
from fastapi import FastAPI, HTTPException, Request, Depends
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

# Load environment variables
load_dotenv()

# Local imports
from graph import graph
from services.tts_service import generate_odia_speech

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

# Pydantic Models for request bodies
class ChatRequest(BaseModel):
    session_id: str
    message: str
    user_id: str

class TTSRequest(BaseModel):
    text: str

class SessionActionRequest(BaseModel):
    session_id: str

class RenameRequest(BaseModel):
    session_id: str
    name: str

# Helper functions
def format_history(messages_list: list) -> list:
    """Format message history for LangGraph"""
    return [
        HumanMessage(content=msg['content']) if msg['role'] == 'user'
        else AIMessage(content=msg['content'])
        for msg in messages_list
    ]

def serialize_messages(messages: list) -> str:
    """Convert messages list to JSON string for storage"""
    try:
        return json.dumps(messages)
    except Exception as e:
        print(f"Error serializing messages: {e}")
        return "[]"

def deserialize_messages(messages_str: str) -> list:
    """Convert JSON string back to messages list"""
    try:
        if not messages_str:
            return []
        return json.loads(messages_str)
    except Exception as e:
        print(f"Error deserializing messages: {e}")
        return []

# --- API Endpoints ---

@app.post("/create-session")
async def create_session():
    """Generates a new session ID for the frontend."""
    session_id = str(uuid.uuid4())
    return {"status": "success", "session_id": session_id}

@app.post("/stream-chat")
async def stream_chat(request: dict):
    """Endpoint for session verification - returns success if session exists"""
    return {"status": "success"}

@app.post("/chat")
async def chat(request: ChatRequest, db: Databases = Depends(get_db)):
    """Main chat endpoint that runs the agentic graph."""
    session_id = request.session_id
    user_id = request.user_id
    user_message = request.message
    
    db_id = os.getenv("APPWRITE_DATABASE_ID")
    collection_id = os.getenv("APPWRITE_COLLECTION_ID")

    try:
        # Try to get existing document
        doc = db.get_document(db_id, collection_id, session_id)
        messages_str = doc.get('messages', '[]')
        messages_history = deserialize_messages(messages_str)
    except Exception as e:
        print(f"Document not found, creating new one: {e}")
        # Create new document
        doc_data = {
            'userId': user_id, 
            'sessionId': session_id, 
            'name': 'New Chat', 
            'messages': '[]'  # Store as JSON string
        }
        permissions = [
            Permission.read(Role.user(user_id)), 
            Permission.update(Role.user(user_id)), 
            Permission.delete(Role.user(user_id))
        ]
        try:
            db.create_document(db_id, collection_id, session_id, doc_data, permissions)
            messages_history = []
        except Exception as create_error:
            print(f"Error creating document: {create_error}")
            raise HTTPException(status_code=500, detail=f"Failed to create chat session: {str(create_error)}")

    # Add user message
    messages_history.append({"role": "user", "content": user_message})
    
    try:
        # Process with AI
        formatted_messages = format_history(messages_history)
        initial_state = {"messages": formatted_messages, "next_agent": ""}
        
        final_state = await graph.ainvoke(initial_state)
        assistant_response = final_state["messages"][-1].content

        # Add assistant response
        messages_history.append({"role": "assistant", "content": assistant_response})
        
        # Serialize and check length
        messages_str = serialize_messages(messages_history)
        
        # Trim if too long (keep last 50 messages max to stay under 100k chars)
        while len(messages_str) > 95000 and len(messages_history) > 2:
            messages_history.pop(0)  # Remove oldest message
            messages_str = serialize_messages(messages_history)
        
        # Update document
        db.update_document(db_id, collection_id, session_id, {'messages': messages_str})
        
        return {"status": "success", "response": assistant_response}
        
    except Exception as e:
        print(f"Error in chat processing: {e}")
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@app.post("/clear-history")
async def clear_history(request: SessionActionRequest, db: Databases = Depends(get_db)):
    """Clears the message history for a given session."""
    try:
        db_id = os.getenv("APPWRITE_DATABASE_ID")
        collection_id = os.getenv("APPWRITE_COLLECTION_ID")
        
        # Check if document exists first
        try:
            db.get_document(db_id, collection_id, request.session_id)
            # If it exists, update it
            db.update_document(db_id, collection_id, request.session_id, {'messages': '[]'})
            return {"status": "success", "message": "Chat history cleared"}
        except:
            # Document doesn't exist
            raise HTTPException(status_code=404, detail="Session not found")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/delete-chat")
async def delete_chat(request: SessionActionRequest, db: Databases = Depends(get_db)):
    """Deletes a chat session document from the database."""
    try:
        db_id = os.getenv("APPWRITE_DATABASE_ID")
        collection_id = os.getenv("APPWRITE_COLLECTION_ID")
        
        db.delete_document(db_id, collection_id, request.session_id)
        return {"status": "success", "message": "Chat session deleted"}
    except Exception as e:
        # If document doesn't exist, still return success
        if "Document with the requested ID could not be found" in str(e):
            return {"status": "success", "message": "Chat session already deleted"}
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rename-chat")
async def rename_chat(request: RenameRequest, db: Databases = Depends(get_db)):
    """Renames a chat session."""
    try:
        db_id = os.getenv("APPWRITE_DATABASE_ID")
        collection_id = os.getenv("APPWRITE_COLLECTION_ID")
        
        db.update_document(db_id, collection_id, request.session_id, {'name': request.name})
        return {"status": "success", "message": "Chat renamed"}
    except Exception as e:
        if "Document with the requested ID could not be found" in str(e):
            raise HTTPException(status_code=404, detail="Session not found")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/text-to-speech")
async def text_to_speech(request: TTSRequest):
    """Generates speech using Sarvam AI TTS."""
    try:
        text = request.text.strip()
        if not text:
            raise HTTPException(status_code=400, detail="Empty text provided")
        
        audio_content = await generate_odia_speech(text)
        
        return StreamingResponse(iter([audio_content]), media_type="audio/wav")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Main entry point
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
