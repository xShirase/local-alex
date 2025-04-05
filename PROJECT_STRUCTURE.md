# MCP Agent Server - Project Structure

## Directory Organization

```
mcp-agent-server/
├── docker-compose.yml       # Main service definition
├── docker/
│   └── .env.example         # Environment variable templates
├── services/
│   ├── agent-api/           # Core orchestration service
│   │   ├── index.js         # Main API entry point
│   │   ├── package.json     # Node.js dependencies
│   │   └── Dockerfile       # Container build instructions
│   ├── n8n/                 # Workflow automation engine
│   │   ├── data/            # Persistent workflow storage
│   │   └── README.md        # Service documentation
│   ├── ollama/              # Local LLM inference server
│   │   └── data/            # Model weights storage
│   └── chromadb/            # Vector memory store
│       └── data/            # Vector embeddings storage
├── docs/                    # Project documentation
│   ├── ARCHITECTURE.md      # System design overview
│   └── GOALS.md             # Project goals and roadmap
├── SETUP.md                 # Setup instructions
└── PROJECT_STRUCTURE.md     # This file
```

## Component Responsibility

### agent-api

The agent-api service is the core orchestration layer that:
- Receives user input via HTTP endpoints
- Routes requests to the appropriate LLM (Ollama/local by default)
- Manages context and memory storage (ChromaDB)
- Delegates tools execution (via n8n webhooks)
- Returns responses to the user

### n8n

The n8n service handles all automation and external API interactions:
- OAuth flows and token management
- API calls to external services (Google Calendar, etc.)
- Structured workflow execution
- Webhook endpoints for the agent to trigger

### ollama

Ollama provides local LLM inference:
- Serves models like mistral, llama2
- Handles prompt completion
- Provides a consistent API for the agent

### chromadb

ChromaDB stores vector embeddings for:
- Long-term memory storage
- Semantic search capabilities
- Context-aware recall

## Future Extensions

The modular design allows adding new services:
- Whisper for voice transcription
- Vault for secrets management
- Custom tool services
- Web UI or frontend clients 