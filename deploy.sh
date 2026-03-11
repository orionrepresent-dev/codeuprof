#!/bin/bash
# Deploy Script - Codeuprof (Orion Studio)
# Execute este script a partir da raiz do repositório na VPS

echo "=> Iniciando processo de deployment (Codeuprof)..."

# 1. Puxar alterações mais recentes
echo "=> Atualizando o código-fonte via Git..."
git pull origin main

# 2. Reconstruir e reiniciar os containers em background
echo "=> Reiniciando containers via docker-compose..."
docker-compose -p codeuprof up -d --build

# 3. Limpeza de imagens Docker antigas (Opcional, mas recomendado em VPS com pouco espaço)
echo "=> Removendo imagens Docker órfãs..."
docker image prune -f

echo "=> Deployment finalizado com sucesso! Containers rodando:"
docker ps --filter name=codeuprof

echo "=> Logs do backend podem ser visualizados com: docker-compose -p codeuprof logs -f backend"
