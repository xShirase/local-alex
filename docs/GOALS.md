# 🎯 Project Goals

## Why I'm Building This

- I want a secure, smart AI assistant that helps with:
  - Personal logistics (calendar, reminders, smart home)
  - Professional work (drafts, dashboards, integrations)
  - Routine automations via voice or chat
- I want this hosted on **my own hardware**, with **no SaaS reliance**
- My fiancée and I will both use it, with separate tools and permissions

---

## Phase Plan

### ✅ Phase 0 – Bootstrap
- Docker Compose with n8n, Ollama, ChromaDB, agent-api
- Basic prompt routing from API to LLM
- Setup `.cursor-rules` and base docs

### 🔜 Phase 1 – Google Calendar (both personal and work)
- OAuth setup for each account in n8n
- Flows for reading/creating events
- Expose as webhooks callable by agent

### Future:
- Slack, WhatsApp, GitHub, Notion, Home Assistant
- Multi-user memory & toolscoping
- Voice input/output loop
- Custom dashboards + shared workflows
