# Linux Deployment Guide

This guide will help you deploy the MCP Agent Server on a Linux environment.

## Prerequisites

- Linux server with Docker and Docker Compose installed
- Git
- Basic knowledge of Linux command line

## Deployment Steps

1. Clone the repository on your Linux server:
   ```bash
   git clone <your-repo-url>
   cd mcp-agent-server
   ```

2. Create your environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration values
   nano .env
   ```

3. Create necessary directories with proper permissions:
   ```bash
   mkdir -p services/chromadb/data services/ollama/data services/n8n/data
   ```

4. Start the services:
   ```bash
   docker compose up -d
   ```

5. Verify services are running:
   ```bash
   docker compose ps
   ```

6. Pull the default Mistral model:
   ```bash
   curl -X POST http://localhost:11434/api/pull -d '{"name": "mistral"}'
   ```

## Service URLs

- Agent API: http://localhost:3000
- n8n: http://localhost:5678
- Ollama: http://localhost:11434

## Common Linux Issues

1. **Permission Issues**: If you encounter permission errors with volumes, try:
   ```bash
   sudo chown -R 1000:1000 services/n8n/data
   ```

2. **Firewall Blocking**: Make sure your firewall allows the required ports:
   ```bash
   sudo ufw allow 3000/tcp
   sudo ufw allow 5678/tcp
   sudo ufw allow 11434/tcp
   ```

3. **Resource Constraints**: If your server has limited resources, adjust the container limits:
   ```yaml
   # Add to docker-compose.yml under specific services
   deploy:
     resources:
       limits:
         memory: 2G
       reservations:
         memory: 1G
   ```

## Monitoring

To monitor your services on Linux:
```bash
# View logs
docker compose logs -f

# View resource usage
docker stats
``` 