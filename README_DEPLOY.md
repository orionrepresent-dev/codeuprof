# Deploy Production - Codeuprof (Orion Studio)

Este guia descreve os comandos para o deployment do backend e frontend.

## 1. Backend (VPS / Docker)
Acesse a VPS, faça o pull do repositório (ou utilize o script `deploy.sh`) e execute o Docker Compose.

```bash
# Subir os containers do backend (FastAPI + Redis) em modo standalone/background
docker-compose -p codeuprof up -d --build

# Para visualizar os logs
docker-compose -p codeuprof logs -f
```

## 2. Frontend (Vercel)
O Frontend está otimizado para a Vercel (`output: 'standalone'`).
Certifique-se de configurar as seguintes variáveis de ambiente no painel da Vercel:

- `NEXT_PUBLIC_API_URL`: "https://api.codigodoeuprofundo.com"
- `NEXT_PUBLIC_SUPABASE_URL`: <sua-url-do-supabase>
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: <sua-anon-key-do-supabase>

## 3. Manutenção e Reinicialização
Se houver alguma alteração e você precisar de um restart rápido:
```bash
./deploy.sh
# ou manualmente:
# docker-compose -p codeuprof restart
```
