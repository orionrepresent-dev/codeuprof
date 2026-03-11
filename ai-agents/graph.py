import json
import logging
import operator
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

import os
import sys
# Add current dir to sys.path so we can import local files directly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from prompts import JUNGUILANO_PROMPT, PAPUS_PROMPT, MAESTRO_PROMPT
from rag_connector import fetch_tarot_references

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("orchestrator_logger")

def save_analysis_to_db(hash_data: dict, maestro_result: str):
    """Saves the deep analysis to Supabase (replacing MCP logging)."""
    from datetime import datetime
    import sys
    import os
    import json
    
    backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
    if backend_path not in sys.path:
        sys.path.append(backend_path)
    
    try:
        from core.supabase_client import supabase
        if not supabase:
            logger.warning("Supabase client not initialized. Skipping DB save.")
            return

        maestro_json = json.loads(maestro_result)
        
        payload = {
            "symbolic_hash": hash_data.get("symbolic_hash"),
            "user_name": hash_data.get("user", {}).get("name"),
            "dob": hash_data.get("user", {}).get("dob"),
            "natal_arcana": hash_data.get("layer_2_natal_arcana"),
            "insight": maestro_json,
            "created_at": datetime.utcnow().isoformat()
        }
        
        supabase.table("analysis_history").insert(payload).execute()
        logger.info(f"Deep Analysis saved to Supabase for hash: {hash_data.get('symbolic_hash')}")
    except json.JSONDecodeError:
        logger.error("Maestro did not return valid JSON. DB save skipped.")
    except Exception as e:
        logger.error(f"Failed to save analysis to Supabase: {e}")

class State(TypedDict):
    hash_data: dict
    junguiano_output: str
    papus_output: str
    maestro_output: str
    messages: Annotated[list[BaseMessage], operator.add]

# Use an affordable/fast model by default, assuming OPENAI_API_KEY is in environment
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
llm_json = ChatOpenAI(model="gpt-4o-mini", temperature=0.2, model_kwargs={"response_format": {"type": "json_object"}})

def junguiano_node(state: State):
    data = state["hash_data"]
    content = f"""
    Name: {data.get('user', {}).get('name')}
    Numerology: {data.get('layer_1_numerology')}
    Natal Arcana: {data.get('layer_2_natal_arcana')}
    Archetypal Signature: {data.get('layer_3_archetypal_signature')}
    Psychological Profile: {data.get('layer_4_psychological_profile')}
    """
    messages = [
        SystemMessage(content=JUNGUILANO_PROMPT),
        HumanMessage(content=content)
    ]
    response = llm.invoke(messages)
    return {"junguiano_output": response.content}

def papus_node(state: State):
    data = state["hash_data"]
    
    # Simple mapping of arcana string to number for the mock RAG
    arcana_name = data.get('layer_2_natal_arcana', '')
    major_arcana = [
        "O Louco", "O Mago", "A Sacerdotisa", "A Imperatriz", "O Imperador", 
        "O Hierofante", "Os Enamorados", "O Carro", "A Justiça", "O Eremita", 
        "A Roda da Fortuna", "A Força", "O Enforcado", "A Morte", "A Temperança", 
        "O Diabo", "A Torre", "A Estrela", "A Lua", "O Sol", "O Julgamento", "O Mundo"
    ]
    
    arcana_number = 0
    if arcana_name in major_arcana:
        arcana_number = major_arcana.index(arcana_name)
        
    rag_reference = fetch_tarot_references(arcana_number)
    
    content = f"""
    Numerology: {data.get('layer_1_numerology')}
    Natal Arcana: {arcana_name}
    
    References from 'Tarô dos Boêmios':
    {rag_reference}
    """
    
    messages = [
        SystemMessage(content=PAPUS_PROMPT),
        HumanMessage(content=content)
    ]
    response = llm.invoke(messages)
    return {"papus_output": response.content}

def maestro_node(state: State):
    junguiano = state.get("junguiano_output", "")
    papus = state.get("papus_output", "")
    
    content = f"""
    Output do Especialista Junguiano:
    {junguiano}
    
    Output do Especialista Papus:
    {papus}
    """
    
    messages = [
        SystemMessage(content=MAESTRO_PROMPT),
        HumanMessage(content=content)
    ]
    response = llm_json.invoke(messages)
    
    # The response is JSON formatted string.
    maestro_result = response.content
    
    # Save directly to Supabase SDK
    save_analysis_to_db(state["hash_data"], maestro_result)
    
    return {"maestro_output": maestro_result}

def chat_node(state: State):
    """Handles follow-up interactive chat after the initial generation."""
    # Build complete context
    maestro_sys = f"""
    You are the Maestro, an esoteric guide. Respond to the user's questions about their archetype and symbolic hash.
    Keep the tone esoteric, wise, and slightly mysterious, but helpful.
    
    Context of their Archetype:
    {state.get("maestro_output", "No previous synthesis available.")}
    """
    
    # We only pass the latest messages to the LLM (plus system prompt)
    messages = [SystemMessage(content=maestro_sys)] + state.get("messages", [])
    
    # Use standard llm (not json) since we want chat responses
    response = llm.invoke(messages)
    
    # Return the new message to append to state
    return {"messages": [response]}

# Build Graph
builder = StateGraph(State)

builder.add_node("junguiano", junguiano_node)
builder.add_node("papus", papus_node)
builder.add_node("maestro", maestro_node)
builder.add_node("chat", chat_node)

def route_start(state: State):
    """Router to determine if we start a new analysis or jump to chat."""
    if state.get("maestro_output"):
        return ["chat"]
    return ["junguiano", "papus"]

builder.add_conditional_edges(START, route_start, ["junguiano", "papus", "chat"])
builder.add_edge("junguiano", "maestro")
builder.add_edge("papus", "maestro")

# After initial synthesis is done, we don't go to chat immediately, we just end.
# The user will explicitly invoke the graph again which triggers route_start to chat
builder.add_edge("maestro", END)
builder.add_edge("chat", END)

# Set up memory for checkpointing thread history
import sqlite3
from langgraph.checkpoint.sqlite import SqliteSaver

db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "checkpoints.sqlite")
conn = sqlite3.connect(db_path, check_same_thread=False)
memory = SqliteSaver(conn)

orchestrator_graph = builder.compile(checkpointer=memory)
