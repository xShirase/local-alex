# Google Workspace MCP Server

![Robot Assistant](https://raw.githubusercontent.com/aaronsb/google-workspace-mcp/main/docs/assets/robot-assistant.png)

This Model Context Protocol (MCP) server puts you in control of your Google Workspace. Once you connect your account - a simple, secure process that takes just a minute - you're ready to go. Behind the scenes, it keeps your connection safe and active, so you can focus on getting things done instead of managing logins and permissions.

Take command of your Gmail inbox in ways you never thought possible. Want that proposal from last quarter? Found in seconds. Drowning in newsletters? They'll sort themselves into folders automatically. Need to track responses to an important thread? Labels and filters do the work for you. From drafting the perfect email to managing conversations with your team, everything just clicks into place. With streamlined attachment handling, you can easily find and manage email attachments while the system takes care of all the complex metadata behind the scenes.

Your calendar becomes a trusted ally in the daily juggle. No more double-booked meetings or timezone confusion. Planning a team sync? It spots the perfect time slots. Running a recurring workshop? Set it up once, and you're done. Even when plans change, finding new times that work for everyone is quick and painless. The days of endless "when are you free?" emails are over.

Turn Google Drive from a file dump into your digital command center. Every document finds its place, every folder tells a story. Share files with exactly the right people - no more "who can edit this?" confusion. Looking for that presentation from last week's meeting? Search not just names, but what's inside your files. Whether you're organizing a small project or managing a mountain of documents, everything stays right where you need it.

## TL;DR Setup

> **Note**: For AI assistants like Cline, see [llms-install.md](llms-install.md) for specialized installation guidance.

1. Create Google Cloud Project:
   ```bash
   # Go to Google Cloud Console
   https://console.cloud.google.com
   → Create Project
   → Enable Gmail API and Calendar API
   → Configure OAuth consent screen (External)
   → Create OAuth Desktop Client ID and Secret
   ```

2. Add to Cline settings (e.g., `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`):
   ```json
   {
     "mcpServers": {
       "google-workspace-mcp": {
         "command": "docker",
         "args": [
           "run",
           "--rm",
           "-i",
           "-v", "/home/aaron/.mcp/google-workspace-mcp:/app/config",
           "-v", "/home/aaron/Documents/workspace-mcp-files:/app/workspace",
           "-e", "GOOGLE_CLIENT_ID",
           "-e", "GOOGLE_CLIENT_SECRET",
           "-e", "LOG_MODE=strict",
           "ghcr.io/aaronsb/google-workspace-mcp:latest"
         ],
         "env": {
           "GOOGLE_CLIENT_ID": "123456789012-abcdef3gh1jklmn2pqrs4uvw5xyz6789.apps.googleusercontent.com",
           "GOOGLE_CLIENT_SECRET": "GOCSPX-abcdefghijklmnopqrstuvwxyz1234"
         },
         "autoApprove": [],
         "disabled": false
       }
     }
   }
   ```

   Logging modes:
   - `normal` (default): Uses appropriate console methods for each log level
   - `strict`: Routes all non-JSON-RPC messages to stderr (recommended for Claude desktop)

4. Restart Cline/Claude

5. Just ask the AI to "add my Google account" - it will guide you through the authentication process conversationally.

See [detailed setup guide](#prerequisites) for more information.

## Prerequisites

Before using this MCP server, you must set up your own Google Cloud Project with access to Google Workspace APIs:

1. Create a new project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable the required APIs:
   - Gmail API
   - Google Calendar API
   - Google Drive API
3. Configure the OAuth consent screen:
   - Set up as "External"
   - Add yourself as a test user
   - Add required scopes for Gmail, Calendar, and Drive
4. Create OAuth 2.0 credentials:
   - Choose "Desktop application" type
   - Note your Client ID and Client Secret
   - Use "urn:ietf:wg:oauth:2.0:oob" as the redirect URI (this enables out-of-band authentication)

The MCP server requires:
1. Your Google OAuth Client ID and Secret from the steps above
2. Local directory path for storing configuration (recommended: `~/.mcp/google-workspace-mcp`)

Note: This server uses out-of-band (OOB) authentication flow, which means you'll need to manually copy-paste authorization codes during the initial setup of each account.

### Using with Cline

Add the following configuration to your Cline MCP settings:

```json
{
  "mcpServers": {
    "google-workspace-mcp": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-v", "/home/aaron/.mcp/google-workspace-mcp:/app/config",
        "-e", "GOOGLE_CLIENT_ID",
        "-e", "GOOGLE_CLIENT_SECRET",
        "-e", "LOG_MODE=strict",
        "ghcr.io/aaronsb/google-workspace-mcp:latest"
      ],
      "env": {
        "GOOGLE_CLIENT_ID": "123456789012-abcdef3gh1jklmn2pqrs4uvw5xyz6789.apps.googleusercontent.com",
        "GOOGLE_CLIENT_SECRET": "GOCSPX-abcdefghijklmnopqrstuvwxyz1234"
      },
      "autoApprove": [],
      "disabled": false
    }
  }
}
```

### File Management

The server automatically manages files in a structured way:

```
~/Documents/workspace-mcp-files/
├── [email_1@domain.com]/
│   ├── downloads/        # Files downloaded from Drive
│   └── uploads/         # Files staged for upload
├── [email_2@domain.com]/
│   ├── downloads/
│   └── uploads/
└── shared/
    └── temp/           # Temporary files (cleaned up automatically)
```

The WorkspaceManager creates and maintains this structure automatically:
- Creates directories as needed when files are downloaded/uploaded
- Organizes files by user email
- Handles temporary file cleanup
- Maintains proper permissions

You can customize the workspace location by setting the `WORKSPACE_BASE_PATH` environment variable.

### Manual Usage

> **Important**: The server requires an `accounts.json` file in the mounted config directory. For first-time setup, copy `accounts.example.json` to `accounts.json` in your config directory before starting the container.

You can run the container directly:

```bash
docker run -i --rm \
  -v ~/.mcp/google-workspace-mcp:/app/config \
  -v ~/Documents/workspace-mcp-files:/app/workspace \
  -e GOOGLE_CLIENT_ID=123456789012-abcdef3gh1jklmn2pqrs4uvw5xyz6789.apps.googleusercontent.com \
  -e GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz1234 \
  -e LOG_MODE=strict \
  ghcr.io/aaronsb/google-workspace-mcp:latest
```

The server will automatically:
- Create and manage all necessary configuration files
- Handle secure storage of credentials and tokens
- Maintain proper file permissions

### Development Build

For local development, you can build and run the container:

```bash
# Build the image
docker build -t google-workspace-mcp:local .

# Run with required environment variables
docker run -i --rm \
  -v ~/.mcp/google-workspace-mcp:/app/config \
  -v ~/Documents/workspace-mcp-files:/app/workspace \
  -e GOOGLE_CLIENT_ID=123456789012-abcdef3gh1jklmn2pqrs4uvw5xyz6789.apps.googleusercontent.com \
  -e GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz1234 \
  -e LOG_MODE=strict \
  google-workspace-mcp:local
```

## Features

- Simplified attachment handling with automatic metadata management
- Streamlined email responses focused on essential information
- Robust attachment indexing and retrieval system
- Efficient file management across Gmail and Calendar
- Automatic cleanup of expired attachments

## Available Tools

### Account Management
- `list_workspace_accounts` (aliases: list_accounts, get_accounts, show_accounts)
  - List all configured Google accounts and authentication status
  - Must be called first before other operations
  - Validates required API scopes
  - Handles multiple account selection

- `authenticate_workspace_account` (aliases: auth_account, add_account, connect_account)
  - Add and authenticate Google accounts for API access
  - Supports account categorization (work, personal)
  - Handles OAuth flow with user interaction
  - Manages token refresh automatically

- `remove_workspace_account` (aliases: delete_account, disconnect_account, remove_account)
  - Remove Google accounts and associated tokens
  - Clean up stored credentials

### Gmail Operations

#### Messages and Search
- `search_workspace_emails` (aliases: search_emails, find_emails, query_emails)
  - Advanced email filtering capabilities:
    - Sender/recipient filtering
    - Subject and content search
    - Date range filtering
    - Attachment presence
    - Label-based filtering
    - Complex Gmail query syntax support
  - Common search patterns for:
    - Meeting emails
    - HR/Admin communications
    - Team updates
    - Newsletters

- `send_workspace_email` (aliases: send_email, send_mail, create_email)
  - Send emails with full formatting
  - Support for CC/BCC recipients
  - Attachment handling
  - Email threading support

#### Settings and Configuration
- `get_workspace_gmail_settings` (aliases: get_gmail_settings, gmail_settings, get_mail_settings)
  - Access account settings
  - Language preferences
  - Signature configuration
  - Vacation responder status
  - Filter and forwarding rules

#### Draft Management
- `manage_workspace_draft` (aliases: manage_draft, draft_operation, handle_draft)
  - Complete draft CRUD operations:
    - Create new drafts
    - Read existing drafts
    - Update draft content
    - Delete drafts
    - Send drafts
  - Support for:
    - New email drafts
    - Reply drafts with threading
    - Draft modifications
    - Draft sending

#### Label Management
- `manage_workspace_label` (aliases: manage_label, label_operation, handle_label)
  - Full label CRUD operations
  - Support for nested labels
  - Custom color configuration
  - Visibility settings

- `manage_workspace_label_assignment` (aliases: assign_label, modify_message_labels, change_message_labels)
  - Apply/remove labels from messages
  - Batch label modifications
  - System label updates

- `manage_workspace_label_filter` (aliases: manage_filter, handle_filter, filter_operation)
  - Create and manage label filters
  - Complex filtering criteria:
    - Sender/recipient patterns
    - Subject/content matching
    - Attachment presence
    - Message size rules
  - Automated actions:
    - Label application
    - Importance marking
    - Read status
    - Archiving

### Calendar Operations

#### Event Management
- `list_workspace_calendar_events` (aliases: list_events, get_events, show_events)
  - List calendar events with filtering
  - Date range specification
  - Text search within events
  - Customizable result limits

- `get_workspace_calendar_event` (aliases: get_event, view_event, show_event)
  - Detailed event information
  - Attendee status
  - Event settings

- `manage_workspace_calendar_event` (aliases: manage_event, update_event, respond_to_event)
  - Event response management:
    - Accept/Decline invitations
    - Mark as tentative
    - Propose new times
    - Update event times
  - Comment support
  - Time zone handling

- `create_workspace_calendar_event` (aliases: create_event, new_event, schedule_event)
  - Create new calendar events
  - Support for:
    - Single events
    - Recurring events (RRULE format)
    - Multiple attendees
    - Time zone specification
    - Event description
    - Conflict checking

- `delete_workspace_calendar_event` (aliases: delete_event, remove_event, cancel_event)
  - Delete calendar events
  - Notification options for attendees

### Drive Operations

#### File Management
- `list_drive_files` (aliases: list_files, get_files, show_files)
  - List files with optional filtering
  - Filter by folder
  - Custom query support
  - Sorting and pagination
  - Field selection

- `search_drive_files` (aliases: search_files, find_files, query_files)
  - Full text search across file content
  - Filter by MIME type
  - Filter by folder
  - Include/exclude trashed files
  - Advanced query options

- `upload_drive_file` (aliases: upload_file, create_file, add_file)
  - Upload new files
  - Set file metadata
  - Specify parent folders
  - Support for various file types

- `download_drive_file` (aliases: download_file, get_file_content, fetch_file)
  - Download any file type
  - Export Google Workspace files
  - Format conversion options
  - Automatic MIME type handling

- `delete_drive_file` (aliases: delete_file, remove_file, trash_file)
  - Delete files and folders
  - Clean removal from Drive

#### Folder Operations
- `create_drive_folder` (aliases: create_folder, new_folder, add_folder)
  - Create new folders
  - Nested folder support
  - Parent folder specification
  - Folder metadata

#### Permissions
- `update_drive_permissions` (aliases: share_file, update_sharing, modify_permissions)
  - Update sharing settings
  - Multiple permission types:
    - User permissions
    - Group permissions
    - Domain sharing
    - Public access
  - Various access roles:
    - Owner
    - Organizer
    - File Organizer
    - Writer
    - Commenter
    - Reader
  - Discovery settings for public files

See [API Documentation](docs/API.md) for detailed usage.

## Coming Soon

### Future Services
- Admin SDK support
- Additional Google services

## Testing Strategy

### Unit Testing Approach

1. **Simplified Mocking**
   - Use static mock responses for predictable testing
   - Avoid complex end-to-end simulations in unit tests
   - Focus on testing one piece of functionality at a time
   - Mock external dependencies (OAuth, file system) with simple implementations

2. **Test Organization**
   - Group tests by functionality (e.g., account operations, file operations)
   - Use clear, descriptive test names
   - Keep tests focused and isolated
   - Reset mocks and modules between tests

3. **Mock Management**
   - Use jest.resetModules() to ensure clean state
   - Re-require modules after mock changes
   - Track mock function calls explicitly
   - Verify both function calls and results

4. **File System Testing**
   - Use simple JSON structures
   - Focus on data correctness over formatting
   - Test error scenarios (missing files, invalid JSON)
   - Verify file operations without implementation details

5. **Token Handling**
   - Mock token validation with static responses
   - Test success and failure scenarios separately
   - Verify token operations without OAuth complexity
   - Focus on account manager's token handling logic

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test path/to/test.ts

# Run tests with coverage
npm test -- --coverage

# CI builds run all tests with coverage reporting
npm run test:ci
```

## Best Practices

1. **Authentication**
   - Store credentials securely in MCP settings
   - Use minimal required scopes
   - Handle token refresh properly

2. **Error Handling**
   - Check response status
   - Handle auth errors appropriately
   - Implement proper retries

3. **Configuration & Security**
   - Each user maintains their own Google Cloud Project
   - Configure OAuth credentials in MCP settings
   - Secure token storage in ~/.mcp/google-workspace-mcp
   - Regular token rotation
   - Never commit sensitive files to git
   - Use proper file permissions for config directory

4. **Local Development Setup**
   - Configure OAuth credentials in MCP settings
   - Create ~/.mcp/google-workspace-mcp directory
   - Keep sensitive tokens out of version control
   - Run authentication script for each account

## Troubleshooting

### Common Setup Issues

1. **Missing Configuration**
   - Error: "GOOGLE_CLIENT_ID environment variable is required"
   - Solution: Configure the OAuth credentials in your MCP settings file (see docs/API.md for details)

2. **Authentication Errors**
   - Error: "Invalid OAuth credentials"
   - Solution:
     - Verify your Google Cloud project is properly configured
     - Ensure you've added yourself as a test user in the OAuth consent screen
     - Check that both Gmail API and Google Calendar API are enabled
     - Verify credentials in MCP settings match your OAuth client configuration

3. **Token Issues**
   - Error: "Token refresh failed"
   - Solution: Remove the account using `remove_workspace_account` and re-authenticate
   - Check that your Google Cloud project has the necessary API scopes enabled

4. **Directory Structure**
   - Error: "Directory not found"
   - Solution: Ensure ~/.mcp/google-workspace-mcp exists with proper permissions
   - Verify Docker has access to mount the config directory

For additional help, consult the [Error Handling](docs/ERRORS.md) documentation.

## License

MIT License - See LICENSE file for details
