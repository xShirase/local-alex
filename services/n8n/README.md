# n8n Service for MCP Agent

This directory contains the n8n service configuration and data persistence for the MCP Agent Server.

## Overview

n8n is used as the automation engine for the MCP Agent, handling:
- External API calls (Google Calendar, etc.)
- OAuth token management
- Webhook endpoints for agent tool calls
- Workflow execution based on agent requests

## Directory Structure

```
services/n8n/
├── data/               # Persistent data (workflows, credentials)
├── custom-nodes/       # (Future) Custom n8n nodes for MCP
└── README.md           # This file
```

## Usage

n8n is accessible at `http://localhost:5678` with the credentials defined in your `.env` file.

## Workflow Development

1. Create a new workflow in the n8n UI
2. Design your automation (e.g., "Create Calendar Event")
3. Enable the webhook trigger for agent access
4. Document the webhook URL for the agent-api

## Authentication

n8n handles all OAuth credentials for third-party services.
When setting up new integrations:

1. Create credentials in n8n
2. Use them in your workflows
3. The agent will trigger these workflows via webhooks without needing direct access to tokens

## Data Persistence

All n8n data is persisted in the `./data` directory, which is mounted as a volume in the Docker container. 