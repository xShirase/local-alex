# MCP Agent Server - Setup Guide

This guide covers setting up the Phase 0 environment for the MCP Agent Server, a self-hosted AI assistant platform.

## Prerequisites

- Docker and Docker Compose
- Git
- Node.js 18+ (for local development)
- A Telegram Bot Token (optional, for Telegram integration)

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

### 4. Configure Telegram Bot (Optional)

To set up the Telegram integration:

1. Talk to [@BotFather](https://t.me/botfather) on Telegram to create a new bot
2. Obtain your bot token and set it in your `.env` file:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```
3. If your server is publicly accessible, set up a webhook:
   ```bash
   curl -F "url=https://your-domain.com/telegram" \
        https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
   ```
4. For local development, you may need to use a service like ngrok to expose your local server:
   ```bash
   ngrok http 3000
   # Then use the ngrok URL in your webhook
   curl -F "url=https://your-ngrok-url.ngrok.io/telegram" \
        https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
   ```
5. Send a message to your bot on Telegram to test the integration

## Docker Volumes

The stack uses these persistent volumes:

- `./services/n8n/data`: n8n credentials and workflows
- `./services/ollama/data`: LLM model weights
- `./services/chromadb/data`: Vector embeddings and memory

## Environment Variables

Key environment variables to configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `N8N_BASIC_AUTH_USER` | Username for n8n access | admin |
| `N8N_BASIC_AUTH_PASSWORD` | Password for n8n access | password |
| `DEFAULT_LOCAL_MODEL` | Default Ollama model to use | mistral |
| `TELEGRAM_BOT_TOKEN` | Token for Telegram bot integration | (none) |

## Next Steps

After Phase 0 is running successfully:

1. Move to Phase 1: Implement Google Calendar integrations via n8n
2. Build the agent's context and memory management
3. Enhance integrations with additional messaging platforms 