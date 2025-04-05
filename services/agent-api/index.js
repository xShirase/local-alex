const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Environment variables
const PORT = process.env.PORT || 3000;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://ollama:11434';
const DEFAULT_LOCAL_MODEL = process.env.DEFAULT_LOCAL_MODEL || 'mistral';
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
    
    // Set defaults for optional parameters
    const userIdToUse = userId || 'default';
    const contextToUse = context || 'personal';
    
    console.log(`Sending request to Ollama at ${OLLAMA_HOST}/api/generate with model ${DEFAULT_LOCAL_MODEL}`);
    
    try {
      // Connect to Ollama API
      console.log('Sending to Ollama:', { model: DEFAULT_LOCAL_MODEL, prompt: message });
      const ollamaResponse = await axios.post(`${OLLAMA_HOST}/api/generate`, {
        model: DEFAULT_LOCAL_MODEL,
        prompt: message
      }, {
        responseType: 'text' // Get raw text response to handle line-by-line JSON
      });
      
      console.log('Received response from Ollama:', ollamaResponse.status);
      
      // Parse the response - Ollama returns newline-delimited JSON objects
      const responseLines = ollamaResponse.data.split('\n').filter(line => line.trim() !== '');
      let fullResponse = '';
      
      // Combine all response tokens
      responseLines.forEach(line => {
        try {
          const parsedLine = JSON.parse(line);
          if (parsedLine.response) {
            fullResponse += parsedLine.response;
          }
        } catch (err) {
          console.error('Error parsing response line:', err);
        }
      });
      
      console.log('Combined response:', fullResponse);
      
      // Return formatted response to client
      const responseObj = {
        response: fullResponse || 'No response from model',
        model: DEFAULT_LOCAL_MODEL,
        userId: userIdToUse,
        context: contextToUse,
        timestamp: new Date().toISOString()
      };
      
      console.log('Returning response object:', responseObj);
      res.status(200).json(responseObj);
    } catch (ollamaError) {
      console.error('Error connecting to Ollama:', ollamaError.message);
      if (ollamaError.response) {
        console.error('Response data:', ollamaError.response.data);
        console.error('Response status:', ollamaError.response.status);
      } else if (ollamaError.request) {
        console.error('No response received:', ollamaError.request);
      } else {
        console.error('Error config:', ollamaError.config);
      }
      res.status(500).json({ 
        error: 'Failed to connect to LLM service',
        details: ollamaError.message
      });
    }
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`MCP Agent API running on port ${PORT}`);
  console.log(`Connected to:
  - Ollama: ${OLLAMA_HOST} (Using model: ${DEFAULT_LOCAL_MODEL})
  - ChromaDB: ${CHROMA_HOST}
  - n8n: ${N8N_HOST}
  `);
}); 