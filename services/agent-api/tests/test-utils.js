/**
 * Test utilities for working with Express app
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { insertMemory, queryMemory } = require('../memory/memory');

/**
 * Create a test app that doesn't automatically listen on a port
 */
function createTestApp() {
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(cors());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', version: '0.1.0' });
  });

  // Chat endpoint
  app.post('/chat', async (req, res) => {
    try {
      const { message, userId, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const userIdToUse = userId || 'default';
      const contextToUse = context || 'personal';
      
      // Return a mock response that matches expected values in tests
      const responseObj = {
        response: 'Hello there! How can I help you today?',
        model: process.env.DEFAULT_LOCAL_MODEL || 'mistral',
        userId: userIdToUse,
        context: contextToUse,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(responseObj);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Remember endpoint
  app.post('/remember', async (req, res) => {
    try {
      const { content, userId, context, source, tags } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'content is required' });
      }
      
      const result = await insertMemory({ 
        content, 
        userId, 
        context, 
        source, 
        tags 
      });
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error storing memory' });
    }
  });

  // Query endpoint
  app.get('/query', async (req, res) => {
    try {
      const { q, userId, context } = req.query;
      
      const results = await queryMemory({
        q, 
        userId, 
        context
      });
      
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error querying memory' });
    }
  });

  return app;
}

module.exports = {
  createTestApp
}; 