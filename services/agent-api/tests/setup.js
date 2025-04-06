// Mock environment variables for testing
process.env.OLLAMA_HOST = 'http://ollama:11434';
process.env.DEFAULT_LOCAL_MODEL = 'mistral';
process.env.CHROMA_HOST = 'http://chromadb:8000';
process.env.N8N_HOST = 'http://n8n:5678';
process.env.TELEGRAM_BOT_TOKEN = 'test-token';

// Avoid actual HTTP requests in tests
jest.mock('axios');

// Silence console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  // Keep error and warn for debugging
  error: console.error,
  warn: console.warn,
}; 