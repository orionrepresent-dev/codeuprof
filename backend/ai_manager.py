import os
import redis
import json
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

# Conexão com seu Redis interno (o mesmo que já está rodando)
redis_client = redis.Redis(host='redis-m4ggwksookgco40sosg408cw', port=6379, db=0)

class AIManager:
    @staticmethod
    def get_llm(complexity='low'):
        if complexity == 'high':
            return ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))
        return ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=os.getenv("GEMINI_API_KEY"))

    @staticmethod
    def get_response(prompt, complexity='low'):
        # 1. Verifica no Cache (Redis)
        cache_key = f"ai_cache:{hash(prompt)}"
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached)

        # 2. Chama a IA escolhida
        llm = AIManager.get_llm(complexity)
        response = llm.invoke(prompt)
        
        # 3. Salva no Cache (Expira em 24h para economizar memória)
        redis_client.setex(cache_key, 86400, json.dumps(response.content))
        return response.content
