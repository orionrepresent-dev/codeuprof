# Use a imagem oficial do Python 3.11 baseada no Debian slim para menor tamanho
FROM python:3.11-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Instala dependências do sistema necessárias para o build de alguns pacotes
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala as dependências Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código do backend e a pasta ai-agents para o container
# Assumindo que o Dockerfile está em /backend e build origin é na raiz do repositório
COPY ./backend /app/backend
COPY ./ai-agents /app/ai-agents

# Define o diretório de trabalho para a pasta do backend onde está o main.py
WORKDIR /app/backend

# Define variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Expõe a porta que a aplicação vai rodar
EXPOSE 8000

# Comando para rodar a aplicação usando Gunicorn com Uvicorn workers
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-c", "gunicorn_conf.py", "main:app"]
