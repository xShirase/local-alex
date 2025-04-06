const request = require('supertest');
const nock = require('nock');
const MockAdapter = require('axios-mock-adapter');
const axios = require('axios');
const { createTestApp } = require('./test-utils');

// Create axios mock adapter
const mock = new MockAdapter(axios);

describe('POST /chat', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    
    // Mock the Ollama API response
    // Ollama returns newline-delimited JSON
    const ollamaResponse = 
      '{"response":"Hello","done":false}\n' +
      '{"response":" there!","done":false}\n' +
      '{"response":" How","done":false}\n' +
      '{"response":" can","done":false}\n' +
      '{"response":" I","done":false}\n' +
      '{"response":" help","done":false}\n' +
      '{"response":" you","done":false}\n' +
      '{"response":" today?","done":true}\n';
    
    // Set up the mock with the given response
    mock.onPost(/\/api\/generate/).reply(200, ollamaResponse);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should return a valid response format when given a valid message', async () => {
    const validInput = {
      message: 'Hello, how are you?',
      userId: 'test-user',
      context: 'test-context'
    };

    const response = await request(app)
      .post('/chat')
      .send(validInput);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('response', 'Hello there! How can I help you today?');
    expect(response.body).toHaveProperty('model');
    expect(response.body).toHaveProperty('userId', 'test-user');
    expect(response.body).toHaveProperty('context', 'test-context');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return 400 when message is missing', async () => {
    const invalidInput = {
      userId: 'test-user',
      context: 'test-context'
    };

    const response = await request(app)
      .post('/chat')
      .send(invalidInput);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Message is required');
  });

  it('should use default userId and context when not provided', async () => {
    const minimalInput = {
      message: 'Hello, how are you?'
    };

    const response = await request(app)
      .post('/chat')
      .send(minimalInput);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userId', 'default');
    expect(response.body).toHaveProperty('context', 'personal');
  });
}); 