# Test Suite for MCP Agent API

This directory contains tests for the MCP Agent API service endpoints using Jest.

## Running Tests

To run all tests:

```bash
npm test
```

To run a specific test file:

```bash
npm test -- tests/remember.test.js
```

## Test Coverage

The tests cover:

1. **Memory Storage** (`/remember` endpoint)
   - Valid memory storage
   - Handling missing content

2. **Memory Query** (`/query` endpoint)
   - Retrieving memories with filters
   - Handling empty queries

3. **Chat Functionality** (`/chat` endpoint)
   - Valid LLM responses from Ollama
   - Handling missing message
   - Default user context handling

## Mocks

The tests use:
- `axios-mock-adapter` for mocking API calls to Ollama
- Jest mocks for ChromaDB interactions
- `supertest` for HTTP request testing

## Pre-commit Hook

Tests automatically run before commits via Husky if you have set up the pre-commit hook:

```bash
npm run setup-husky
```

This validates that code changes don't break the core API endpoints. 