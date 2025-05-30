# Changelog

## [0.2.7] - 2025-04-06

### Added
- Google Workspace MCP Integration
  - Added Google Workspace MCP as a containerized service
  - Integrated Gmail, Google Calendar, and Google Drive APIs
  - Added configuration for OAuth authentication with Google
  - Created documentation for setup and usage
- Updated docker-compose.yml with new service
- Added environment variables for Google Workspace MCP

## [0.2.6] - 2025-04-06

### Added
- Tool invocation capability
  - Implemented parsing of LLM responses for JSON-formatted tool calls
  - Added support for dynamic tool execution via webhook endpoints
  - Added validation of tool existence and endpoint availability
  - Enhanced response formatting with tool results
  - Added error handling for tool invocation failures
- Improved Telegram integration
  - Updated Telegram webhook to support tool invocations
  - Added logging for tool usage in Telegram responses
- Enhanced test suite
  - Added comprehensive tests for tool invocation functionality
  - Created mock implementations for testing tool calls
  - Improved test utilities for simulating various tool scenarios

## [0.2.5] - 2025-04-06

### Added
- Tools injection in chat and Telegram endpoints
  - Modified `/chat` endpoint to load tools and inject them into system prompt
  - Updated `generateOllamaResponse` function used by Telegram webhook
  - Added tool descriptions, parameters, and usage instructions to prompts
  - Enhanced LLM context with available tools for better agent capabilities
- Test suite enhancements
  - Created comprehensive test coverage for tools injection
  - Added mock tools for testing purposes
  - Implemented Telegram webhook tests

## [0.2.4] - 2025-04-06

### Added
- Tools registry system
  - Created `tools/registry.js` module for managing tool definitions
  - Added support for loading tools from a JSON configuration file
  - Implemented validation for tool definitions
  - Added helper functions for accessing tools
  - Created sample tool definitions for calendar, weather, and search

## [0.2.3] - 2025-04-06

### Changed
- Refactored Telegram message storage
  - Replaced direct ChromaDB calls with memory module
  - Moved storage to happen after LLM response is sent
  - Improved non-blocking async implementation with proper error handling
  - Simplified code and reduced duplication

## [0.2.2] - 2025-04-06

### Added
- Memory query API
  - New `/query` GET endpoint to search stored memories
  - Accepts query string, user ID, and context parameters
  - Returns matching documents with relevance scores and metadata
  - Supports filtering by user and context

## [0.2.1] - 2025-04-06

### Added
- Direct memory storage API
  - New `/remember` POST endpoint to store memories
  - Accepts content, user ID, context, source, tags, and timestamp
  - Validates required fields and handles errors properly
  - Returns success/failure status with memory ID

## [0.2.0] - 2025-04-06

### Added
- Telegram bot integration
  - New `/telegram` POST endpoint in agent-api to handle Telegram webhook payloads
  - Support for dynamic responses using Ollama LLM models
  - Improved UX with "Thinking..." status messages that update with the response
  - Webhook handling for receiving and processing messages
- Memory system integration with ChromaDB
  - Created memory module in `services/agent-api/memory/memory.js`
  - Implemented functions for storing and retrieving memories
  - Added support for tagging, metadata, and context-based filtering
  - Automatic collection creation and management
- ChromaDB logging for Telegram messages
  - Messages are now stored in ChromaDB for future reference
  - Implemented with source attribution and timestamps
  - Non-blocking design to maintain performance

### Updated
- Documentation improvements
  - Added Telegram setup instructions to README.md
  - Updated SETUP.md with environment variable information
  - Enhanced PROJECT_STRUCTURE.md with new endpoint details

### Technical
- Improved error handling throughout the codebase
- Added support for environment variables (TELEGRAM_BOT_TOKEN)
- Made Docker Compose configuration more robust
- Added placeholders for future embedding integration 