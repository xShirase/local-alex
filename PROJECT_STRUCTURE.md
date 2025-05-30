# MCP Agent Server - Project Structure

## Directory Organization

```
mcp-agent-server/
├── docker-compose.yml       # Main service definition
├── docker/
│   └── .env.example         # Environment variable templates
├── services/
│   ├── agent-api/           # Core orchestration service
│   │   ├── index.js         # Main API entry point with REST API and Telegram integration
│   │   ├── memory/          # Memory management modules
│   │   │   └── memory.js    # ChromaDB integration for memory storage and retrieval
│   │   ├── tools/           # Tool management modules
│   │   │   ├── registry.js  # Tool registry for loading and validating tools
│   │   │   └── tools.json   # Tool definitions in JSON format
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
- Processes incoming messages from Telegram via webhooks
- Routes requests to the appropriate LLM (Ollama/local by default)
- Manages context and memory storage (ChromaDB)
- Delegates tools execution (via n8n webhooks)
- Returns responses to the user through various channels (API, Telegram)

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

## Modules

### memory

The memory module handles persistent storage of conversations and knowledge:
- Stores and retrieves information from ChromaDB
- Provides vector-based semantic search
- Manages context-aware memory organization

### tools

The tools module manages available tools for the agent:
- Loads tool definitions from configuration files
- Validates tool parameters and endpoints
- Will support dynamic discovery of tools via well-known endpoints

## API Endpoints

The agent-api service exposes these main endpoints:

- `GET /health` - Health check endpoint
- `POST /chat` - Core chat API for direct integration
- `POST /telegram` - Webhook endpoint for Telegram bot integration
- `POST /remember` - Store memories directly in ChromaDB
- `GET /query` - Retrieve and search stored memories

## Future Extensions

The modular design allows adding new services:
- Whisper for voice transcription
- Vault for secrets management
- Custom tool services
- Web UI or frontend clients
- Additional messaging integrations (Discord, Slack, etc.) 