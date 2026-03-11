# Nginx & SSL Configuration Guide
Este guia detalha os passos para configurar seu Nginx como um Proxy Reverso para o backend Gunicorn (FastAPI) e como adquirir/instalar certificados SSL gratuitos via Let's Encrypt / Certbot.

## Pré-requisitos
Ter o domínio `api.codigodoeuprofundo.com` apontado para o IP da sua VPS através dos registros A/CNAME no seu provedor de domínio (ou Cloudflare).

## Passos:

1. **Instalar dependências (Ubuntu/Debian):**
   ```bash
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx
   ```

2. **Remover a configuração default do Nginx (opcional mas recomendado):**
   ```bash
   sudo unlink /etc/nginx/sites-enabled/default
   ```

3. **Criar arquivo de configuração do Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/codigodoeuprofundo
   ```

4. **Colar a seguinte configuração (focando em proxy_pass e upgrade para WebSockets/SSE):**
   ```nginx
   server {
       server_name api.codigodoeuprofundo.com;

       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_addrs;
           proxy_set_header X-Forwarded-Proto $scheme;

           # Essencial para conectar com websockets e stream events (SSE)
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           
           # Aumentar timeouts caso uma query no maestro seja longa
           proxy_read_timeout 300;
           proxy_connect_timeout 300;
           proxy_send_timeout 300;
       }
   }
   ```

5. **Habilitar no Nginx:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/codigodoeuprofundo /etc/nginx/sites-enabled/
   ```

6. **Testar configuração do Nginx e recarregar:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

7. **Configurar SSL Automático com Certbot:**
   ```bash
   sudo certbot --nginx -d api.codigodoeuprofundo.com
   ```
   * Siga as instruções do painel. Assuma a opção de "Redirect" para sempre forçar HTTPS.

8. **Feito!** A sua API agora deve estar disponível em `https://api.codigodoeuprofundo.com`.
