const request = require('supertest');
const nock = require('nock');
const axios = require('axios');
const { createTestApp } = require('./test-utils');

// Mock the axios module for ChromaDB calls
jest.mock('axios');

describe('POST /remember', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    
    // Mock the ChromaDB collection check
    axios.get.mockResolvedValue({
      data: { name: 'memory' }
    });
    
    // Mock the ChromaDB upsert
    axios.post.mockResolvedValue({
      data: { success: true }
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 200 for valid input', async () => {
    const validInput = {
      content: 'Test memory content',
      userId: 'test-user',
      context: 'test-context',
      source: 'test',
      tags: ['test']
    };

    const response = await request(app)
      .post('/remember')
      .send(validInput);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return 400 for missing content', async () => {
    const invalidInput = {
      userId: 'test-user',
      context: 'test-context',
      source: 'test'
    };

    const response = await request(app)
      .post('/remember')
      .send(invalidInput);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('content is required');
  });
}); 