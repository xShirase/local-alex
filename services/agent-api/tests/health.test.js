const request = require('supertest');
const { createTestApp } = require('./test-utils');

describe('GET /health', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  it('should return 200 and status ok', async () => {
    const response = await request(app)
      .get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('version');
  });
}); 