# MCP Agent Server – Self-Hosted AI Assistant

This project is a privacy-first, self-hosted agent platform built on a modular architecture. It orchestrates local and remote LLMs, memory stores, automation workflows, and personal tools via a context-aware API layer.

## 💡 Overview

The system acts as an intelligent assistant that:
- Accepts input from browser, CLI, voice, or API
- Differentiates between **personal** and **work** contexts
- Uses **local LLMs** where possible, **API fallback** where necessary
- Delegates execution (e.g., sending a calendar invite) to **n8n**
- Supports **multi-user mode** (e.g. me + my fiancée), with scoped tools/memory

## 📦 Components

| Service       | Description                                   |
|---------------|-----------------------------------------------|
| `n8n`         | Orchestration and external API execution      |
| `ollama`      | Local model runtime for LLM inference         |
| `chromadb`    | Vector memory (long-term, user/context aware) |
| `agent-api`   | Core orchestrator backend                     |
| `frontend`    | (Optional) UI for chat + voice I/O            |
| `whisper`     | (Optional) Voice transcription service        |

---

## 🚀 Phase 0 Goals

✅ Self-hosted base stack on Proxmox  
✅ Local LLM running via Ollama  
✅ ChromaDB running with persistent volume  
✅ Agent API accepting prompts and returning completions  
✅ n8n accessible for automations and flow building

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
docker-compose up -d
```*