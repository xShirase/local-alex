const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Environment variables
const PORT = process.env.PORT || 3000;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://ollama:11434';
const CHROMA_HOST = process.env.CHROMA_HOST || 'http://chromadb:8000';
const N8N_HOST = process.env.N8N_HOST || 'http://n8n:5678';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: '0.1.0' });
});

/**
 * Chat endpoint - Core agent orchestration
 * 
 * Flow:
 * 1. Get user input and context
 * 2. Retrieve relevant memory from ChromaDB (if needed)
 * 3. Generate LLM response via Ollama
 * 4. Parse for tool calls (n8n webhooks) 
 * 5. Store conversation in memory
 * 6. Return response to user
 */
app.post('/chat', async (req, res) => {
  try {
    const { message, userId, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // TODO: Implement actual agent routing logic
    
    // Placeholder response
    const response = {
      id: Date.now().toString(),
      message: `[Phase 0 Placeholder] You said: ${message}`,
      userId: userId || 'default',
      context: context || 'personal',
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`MCP Agent API running on port ${PORT}`);
  console.log(`Connected to:
  - Ollama: ${OLLAMA_HOST}
  - ChromaDB: ${CHROMA_HOST}
  - n8n: ${N8N_HOST}
  `);
}); 