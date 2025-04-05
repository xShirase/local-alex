# 🧱 Architecture – MCP Agent Server

## 🔗 System Map

This system is designed to separate:
- **LLM reasoning** (Ollama, OpenAI, etc.)
- **Execution tools** (n8n workflows)
- **Memory/context storage** (ChromaDB)
- **Input/output interfaces** (chat, voice, webhooks)

## 🧩 Components

### 1. Agent API (`agent-api/`)
- Accepts chat input via REST
- Determines context: user + personal/work
- Routes prompt to LLM (Ollama/local or OpenAI API)
- Handles tool calls (via n8n or direct plugins)
- Stores/retrieves memory in Chroma

### 2. Ollama
- Serves models like `mistral`, `llama2`, etc.
- Used by `agent-api` for low-latency, private inference
- Accessible on Docker network as `http://ollama:11434`

### 3. n8n
- Executes external workflows (e.g. Google Calendar)
- OAuth tokens and API calls live here
- Webhook endpoints can be called from agent tools

### 4. ChromaDB
- Vector database for memory recall
- Namespaced by user + context
- Used to inject relevant long-term context into LLM prompts

### 5. Whisper (optional)
- Transcribes `.wav` or `.mp3` audio to text
- Exposed as `/transcribe` endpoint
- Integrates into voice input frontend

---

## 🔄 Flow Diagram (MVP Phase 0)

```mermaid
graph TD
  UI[User Input (chat/voice/cli)]
  API[Agent API]
  LLM[Ollama (LLM)]
  MEM[ChromaDB]
  N8N[n8n (tool executor)]

  UI --> API
  API --> LLM
  API --> MEM
  API --> N8N
  MEM --> API
  LLM --> API
  N8N --> API
  API --> UI
🔐 Identity & Context Separation
Context = (user_id, mode)

All memory, tools, and model choices scoped by context

Future: JWT-auth + RBAC to limit tool access per user
