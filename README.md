# MCP Agent Server – Self-Hosted AI Assistant

This project is a privacy-first, self-hosted agent platform built on a modular architecture. It orchestrates local and remote LLMs, memory stores, automation workflows, and personal tools via a context-aware API layer.

## 💡 Overview

The system acts as an intelligent assistant that:
- Accepts input from browser, CLI, voice, API, or Telegram
- Differentiates between **personal** and **work** contexts
- Uses **local LLMs** where possible, **API fallback** where necessary
- Delegates execution (e.g., sending a calendar invite) to **n8n**
- Supports **multi-user mode** (e.g. me + my fiancée), with scoped tools/memory

## 📦 Components

| Service       | Description                                     |
|---------------|-------------------------------------------------|
| `n8n`         | Orchestration and external API execution        |
| `ollama`      | Local model runtime for LLM inference           |
| `chromadb`    | Vector memory (long-term, user/context aware)   |
| `agent-api`   | Core orchestrator backend with Telegram support |
| `frontend`    | (Optional) UI for chat + voice I/O              |
| `whisper`     | (Optional) Voice transcription service          |

---

## 🚀 Phase 0 Goals

✅ Self-hosted base stack on Proxmox  
✅ Local LLM running via Ollama  
✅ ChromaDB running with persistent volume  
✅ Agent API accepting prompts and returning completions  
✅ n8n accessible for automations and flow building  
✅ Telegram bot integration for messaging

---

## 📂 Project Structure

mcp-agent-server/ 
├── docker-compose.yml
├── services/ 
│ ├── agent-api/ # Node or Python API backend
│ ├── n8n/ # n8n data + extensions
│ ├── whisper/ # Voice-to-text logic (optional) 
│ └── ... 
├── docs/ # Architecture, design, integrations 
└── .cursor-rules # Cursor IDE custom ruleset

---

## 🔐 Philosophy

This system avoids unnecessary cloud reliance and emphasizes:

- 🔒 **Privacy**: user data never leaves the server unless explicitly intended
- 💡 **Local-first**: local LLMs, self-hosted vector memory, internal service mesh
- 🔧 **Modularity**: everything is Dockerized and composable
- 🧠 **Agent-Oriented**: LLMs reason, n8n executes

---

## 🛠️ Getting Started

```bash
# Clone and configure
git clone your-repo-url
cd mcp-agent-server
cp .env.example .env
# Configure your environment variables including TELEGRAM_BOT_TOKEN if needed
docker-compose up -d
```

---

## 📱 Messaging Integrations

The agent supports the following messaging platforms:

### Telegram

Set up a Telegram bot and integrate it with your MCP Agent:

1. Talk to [@BotFather](https://t.me/botfather) on Telegram to create a new bot
2. Obtain your bot token and add it to your `.env` file as `TELEGRAM_BOT_TOKEN`
3. Set your webhook URL to: `https://your-server/telegram`
4. Start chatting with your bot on Telegram!