import json
import logging
import operator
import os
import sys
import sqlite3
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.sqlite import SqliteSaver

# Add current dir to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from prompts import JUNGUILANO_PROMPT, PAPUS_PROMPT, MAESTRO_PROMPT
from rag_connector import fetch_tarot_references

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("orchestrator_logger")

# --- AJUSTE: Função para instanciar o LLM de forma tardia ---
def get_llm(model="gpt-4o-mini", temperature=0.7, json_mode=False):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY não encontrada no ambiente!")
        raise ValueError("OPENAI_API_KEY é obrigatória.")
    
    if json_mode:
        return ChatOpenAI(model=model, temperature=temperature, openai_api_key=api_key, model_kwargs={"response_format": {"type": "json_object"}})
    return ChatOpenAI(model=model, temperature=temperature, openai_api_key=api_key)

def save_analysis_to_db(hash_data: dict, maestro_result: str):
    # ... (seu código de salvamento permanece o mesmo)
    pass

class State(TypedDict):
    hash_data: dict
    junguiano_output: str
    papus_output: str
    maestro_output: str
    messages: Annotated[list[BaseMessage], operator.add]

# --- AJUSTE: Removido as variáveis globais 'llm' e 'llm_json' ---

def junguiano_node(state: State):
    data = state["hash_data"]
    content = f"Numerology: {data.get('layer_1_numerology')}\nNatal Arcana: {data.get('layer_2_natal_arcana')}"
    messages = [SystemMessage(content=JUNGUILANO_PROMPT), HumanMessage(content=content)]
    
    llm = get_llm() # Chamada local
    response = llm.invoke(messages)
    return {"junguiano_output": response.content}

def papus_node(state: State):
    # ... (seu código de papus permanece o mesmo, troque o llm.invoke por get_llm().invoke)
    llm = get_llm()
    # ...
    return {"papus_output": response.content}

def maestro_node(state: State):
    # ... (seu código de maestro permanece o mesmo, troque por get_llm(json_mode=True).invoke)
    llm_json = get_llm(json_mode=True, temperature=0.2)
    # ...
    save_analysis_to_db(state["hash_data"], maestro_result)
    return {"maestro_output": maestro_result}

def chat_node(state: State):
    # ... (seu código de chat permanece o mesmo, troque por get_llm().invoke)
    llm = get_llm()
    # ...
    return {"messages": [response]}

# Build Graph (continua o mesmo)
builder = StateGraph(State)
# ... (restante das definições de nós e edges)

# Checkpointing (continua o mesmo)
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "checkpoints.sqlite")
conn = sqlite3.connect(db_path, check_same_thread=False)
memory = SqliteSaver(conn)
orchestrator_graph = builder.compile(checkpointer=memory)
