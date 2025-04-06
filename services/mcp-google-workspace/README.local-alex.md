# Google Workspace MCP Integration

This directory contains the Google Workspace MCP (Machine-to-Machine Connector Protocol) server for the local-alex agent stack. The service provides access to Google Workspace APIs, including Gmail, Google Calendar, and Google Drive.

## Setup Instructions

1. Create a Google Cloud Project:
   - Go to the [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable the Gmail API, Google Calendar API, and Google Drive API
   - Create OAuth 2.0 credentials (Client ID and Client Secret)

2. Configure Environment Variables:
   - Add the following variables to your `.env` file:
     ```
     GOOGLE_MCP_PORT=8700
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     WORKSPACE_BASE_PATH=/app/workspace
     ```

3. First-time Authentication:
   - Start the service with `docker-compose up google-workspace-mcp`
   - Follow the authentication prompt in the logs
   - Complete the OAuth flow to grant access to your Google account

## Available Endpoints

The Google Workspace MCP server exposes various endpoints for accessing Google services:

- **Gmail**: 
  - `http://google-workspace-mcp:8700/api/gmail/...`
  
- **Google Calendar**:
  - `http://google-workspace-mcp:8700/api/calendar/...`
  
- **Google Drive**:
  - `http://google-workspace-mcp:8700/api/drive/...`

For detailed API documentation, please refer to the [original project repository](https://github.com/aaronsb/google-workspace-mcp).

## Integration with Agent API

To use these services from your agent, you can create tools that make requests to the Google Workspace MCP endpoints. This allows your agent to interact with Gmail, Calendar, and Drive services.

Example webhook configuration for n8n:
```
POST http://google-workspace-mcp:8700/api/gmail/messages
```

## Troubleshooting

If you encounter authentication issues:
1. Check the logs: `docker-compose logs google-workspace-mcp`
2. Delete the token file in the config directory and reauthenticate
3. Verify that your Google Cloud Project has the necessary APIs enabled 