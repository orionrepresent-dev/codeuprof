from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from core.symbolic_engine import engine
import uvicorn
import os
import sys
import importlib.util
import json
from langchain_core.messages import HumanMessage
from typing import Optional

# Load the orchestrator dynamically because of the hyphen in 'ai-agents'
agents_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ai-agents'))
graph_path = os.path.join(agents_dir, 'graph.py')

spec = importlib.util.spec_from_file_location("orchestrator_graph_module", graph_path)
ai_graph_module = importlib.util.module_from_spec(spec)
sys.modules["orchestrator_graph_module"] = ai_graph_module
spec.loader.exec_module(ai_graph_module)
orchestrator_graph = ai_graph_module.orchestrator_graph
app = FastAPI(
    title="Código do Eu Profundo API",
    description="OS de Consciência Simbólica API Backend",
    version="1.0.0"
)

# CORS configurations for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "https://app.codigodoeuprofundo.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HashRequest(BaseModel):
    name: str
    dob: str # Expected format YYYY-MM-DD

class DeepAnalysisRequest(BaseModel):
    hash_data: dict
    thread_id: Optional[str] = None

class ChatFollowupRequest(BaseModel):
    thread_id: str
    message: str

@app.get("/")
def read_root():
    return {
        "status": "online", 
        "message": "Orquestra Simbólica Initiated. Core Engine is ready."
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/codeuprof/api/v1/generate-hash")
def generate_symbolic_hash(request: HashRequest):
    if not request.name or not request.dob:
        raise HTTPException(status_code=400, detail="Name and DOB are required")
    
    result = engine.generate_symbolic_hash(request.name, request.dob)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result

@app.post("/codeuprof/api/v1/deep-analysis")
def deep_analysis(request: DeepAnalysisRequest):
    try:
        thread_id = request.thread_id or request.hash_data.get("symbolic_hash", "default_thread")
        config = {"configurable": {"thread_id": thread_id}}
        
        # Run graph
        initial_state = {
            "hash_data": request.hash_data,
            "junguiano_output": "",
            "papus_output": "",
            "maestro_output": "",
            "messages": []
        }
        result = orchestrator_graph.invoke(initial_state, config=config)
        
        # Parse Maestro output as JSON
        maestro_json = json.loads(result["maestro_output"])
        
        # Save on Reveal
        engine.save_revelation(request.hash_data, maestro_json)
        
        return maestro_json
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Maestro did not return valid JSON: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/codeuprof/api/v1/chat-followup")
def chat_followup(request: ChatFollowupRequest):
    try:
        config = {"configurable": {"thread_id": request.thread_id}}
        user_message = HumanMessage(content=request.message)
        
        # Invoke the graph with the new message
        result = orchestrator_graph.invoke({"messages": [user_message]}, config=config)
        
        # Get the AI's last message from the result
        last_message = result["messages"][-1]
        
        return {"response": last_message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/codeuprof/api/v1/user/history")
def get_user_history(symbolic_hash: str):
    from core.supabase_client import supabase
    try:
        if not supabase:
            return {"status": "skipped", "message": "Supabase client not initialized", "data": []}
            
        response = supabase.table("analysis_history").select("*").eq("symbolic_hash", symbolic_hash).order("created_at", desc=True).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
