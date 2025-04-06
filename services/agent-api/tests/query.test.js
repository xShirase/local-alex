const request = require('supertest');
const nock = require('nock');
const axios = require('axios');
const { createTestApp } = require('./test-utils');

// Mock the axios module for ChromaDB calls
jest.mock('axios');

describe('GET /query', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    
    // Mock the ChromaDB collection check
    axios.get.mockResolvedValue({
      data: { name: 'memory' }
    });
    
    // Mock the ChromaDB query response
    axios.post.mockResolvedValue({
      data: {
        documents: ['Memory content 1', 'Memory content 2'],
        metadatas: [
          { userId: 'test-user', context: 'test', timestamp: '2025-04-06T12:00:00Z' },
          { userId: 'test-user', context: 'test', timestamp: '2025-04-06T13:00:00Z' }
        ],
        distances: [0.1, 0.3]
      }
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 200 and array with mocked ChromaDB response', async () => {
    const response = await request(app)
      .get('/query')
      .query({ q: 'test query', userId: 'test-user', context: 'test' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    
    // Check the structure of the first result
    expect(response.body[0]).toHaveProperty('content', 'Memory content 1');
    expect(response.body[0]).toHaveProperty('metadata');
    expect(response.body[0]).toHaveProperty('relevance');
    expect(response.body[0].metadata).toHaveProperty('userId', 'test-user');
  });

  it('should handle query with no parameters', async () => {
    const response = await request(app)
      .get('/query');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
}); 