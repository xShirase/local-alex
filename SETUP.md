# MCP Agent Server - Setup Guide

This guide covers setting up the Phase 0 environment for the MCP Agent Server, a self-hosted AI assistant platform.

## Prerequisites

- Docker and Docker Compose
- Git
- Node.js 18+ (for local development)

## Quick Start

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd mcp-agent-server
   ```

2. Configure your environment variables:
   ```bash
   cp docker/.env.example docker/.env
   # Edit docker/.env with your preferred settings
   ```

3. Start the stack:
   ```bash
   docker-compose up -d
   ```

4. Access the services:
   - n8n: http://localhost:5678
   - Agent API: http://localhost:3000/health

## First-Time Setup

### 1. Pull Local Models with Ollama

After the stack is running, pull the default model:

```bash
curl -X POST http://localhost:11434/api/pull -d '{"name": "mistral"}'
```

### 2. Configure n8n

1. Access n8n at http://localhost:5678
2. Login with the credentials from your .env file
3. Create a test workflow with a webhook trigger
4. Copy the webhook URL for agent integration

### 3. Test the Agent API

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, agent", "userId": "default", "context": "personal"}'
```

## Docker Volumes

The stack uses these persistent volumes:

- `./services/n8n/data`: n8n credentials and workflows
- `./services/ollama/data`: LLM model weights
- `./services/chromadb/data`: Vector embeddings and memory

## Next Steps

After Phase 0 is running successfully:

1. Move to Phase 1: Implement Google Calendar integrations via n8n
2. Build the agent's context and memory management
3. Extend the `/chat` endpoint with real LLM integration 