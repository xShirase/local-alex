const request = require('supertest');
const nock = require('nock');
const axios = require('axios');
const { createTestApp } = require('./test-utils');

// Import tool registry mock
const toolRegistry = require('../tools/registry');

// Mock the axios module
jest.mock('axios');

describe('POST /telegram', () => {
  let app;
  
  // Set up environment variables for the test
  const originalEnv = process.env;
  
  beforeEach(() => {
    // Set up environment variables
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
    
    app = createTestApp();
    
    // Spy on the tool loading function
    jest.spyOn(toolRegistry, 'loadTools');
    
    // Mock axios for Telegram API calls
    axios.post.mockImplementation((url, data) => {
      return Promise.resolve({ data: { ok: true } });
    });
  });
  
  afterEach(() => {
    // Restore environment variables
    process.env = originalEnv;
    
    // Reset mocks
    jest.resetAllMocks();
  });
  
  it('should handle valid Telegram messages and respond', async () => {
    const validInput = {
      message: {
        text: 'Hello bot',
        chat: {
          id: 12345
        }
      }
    };
    
    const response = await request(app)
      .post('/telegram')
      .send(validInput);
    
    // Telegram webhook should return 200 OK immediately
    expect(response.status).toBe(200);
    
    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Verify that tools were loaded during response generation
    expect(toolRegistry.loadTools).toHaveBeenCalled();
  });
  
  it('should handle incomplete Telegram messages gracefully', async () => {
    const invalidInput = {
      update_id: 12345
      // Missing message data
    };
    
    const response = await request(app)
      .post('/telegram')
      .send(invalidInput);
    
    expect(response.status).toBe(200);
  });
}); 