# Changelog

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