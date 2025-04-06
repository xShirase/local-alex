const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Get ChromaDB endpoint from environment variables
const CHROMA_HOST = process.env.CHROMA_HOST || 'http://chromadb:8000';
const COLLECTION_NAME = 'memory';

/**
 * Initialize the memory collection if it doesn't exist
 * @returns {Promise<void>}
 */
async function ensureCollectionExists() {
  try {
    // Check if collection exists
    await axios.get(`${CHROMA_HOST}/api/v1/collections/${COLLECTION_NAME}`);
    console.log(`Collection "${COLLECTION_NAME}" found in ChromaDB`);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Collection doesn't exist, create it
      await axios.post(`${CHROMA_HOST}/api/v1/collections`, {
        name: COLLECTION_NAME,
        metadata: { description: "Agent memory storage" }
      });
      console.log(`Created collection "${COLLECTION_NAME}" in ChromaDB`);
    } else {
      // Some other error occurred
      console.error(`Error checking collection existence: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Insert a memory into ChromaDB
 * @param {Object} params Memory data to insert
 * @param {string} params.content The actual text content to store
 * @param {string} params.userId User identifier
 * @param {string} params.context Context (e.g., "personal", "work")
 * @param {string} params.source Source of the memory (e.g., "telegram", "chat")
 * @param {Array<string>} params.tags Optional tags for the memory
 * @param {string} params.timestamp ISO timestamp (defaults to now)
 * @returns {Promise<Object>} Result of the operation
 */
async function insertMemory({ content, userId, context, source, tags = [], timestamp = null }) {
  try {
    // Ensure the collection exists
    await ensureCollectionExists();
    
    // Generate a unique ID for this memory
    const memoryId = uuidv4();
    
    // Use current time if timestamp is not provided
    const timestampToUse = timestamp || new Date().toISOString();
    
    // Prepare metadata (everything except content)
    const metadata = {
      userId: userId || 'default',
      context: context || 'personal',
      source: source || 'unknown',
      timestamp: timestampToUse,
      tags: Array.isArray(tags) ? tags : []
    };
    
    // Prepare the record for ChromaDB
    const record = {
      ids: [memoryId],
      embeddings: [[0.1, 0.2, 0.3]], // Dummy embedding as requested
      metadatas: [metadata],
      documents: [content]
    };
    
    // Insert the memory into ChromaDB
    const response = await axios.post(
      `${CHROMA_HOST}/api/v1/collections/${COLLECTION_NAME}/upsert`,
      record
    );
    
    console.log(`Memory inserted with ID: ${memoryId}`);
    return { 
      success: true,
      id: memoryId,
      timestamp: timestampToUse 
    };
  } catch (error) {
    console.error(`Error inserting memory: ${error.message}`);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Query memories from ChromaDB based on a query and filters
 * @param {Object} params Query parameters
 * @param {string} params.q The query text
 * @param {string} params.userId User identifier to filter by
 * @param {string} params.context Context to filter by (e.g., "personal", "work")
 * @returns {Promise<Array>} Matching memories
 */
async function queryMemory({ q, userId, context }) {
  try {
    // Ensure the collection exists
    await ensureCollectionExists();
    
    // Prepare query filters based on provided parameters
    const where = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (context) {
      where.context = context;
    }
    
    // Prepare the query
    const queryData = {
      query_embeddings: [[0.1, 0.2, 0.3]], // Dummy embedding as requested
      n_results: 5, // Return top 5 results
      include: ["documents", "metadatas", "distances"]
    };
    
    // Add where filter if we have conditions
    if (Object.keys(where).length > 0) {
      queryData.where = where;
    }
    
    // Execute the query
    const response = await axios.post(
      `${CHROMA_HOST}/api/v1/collections/${COLLECTION_NAME}/query`,
      queryData
    );
    
    // Format the results
    let results = [];
    if (response.data && response.data.documents) {
      results = response.data.documents.map((doc, index) => {
        return {
          content: doc,
          metadata: response.data.metadatas[index],
          relevance: response.data.distances ? 1 - response.data.distances[index] : 0
        };
      });
    }
    
    console.log(`Memory query returned ${results.length} results`);
    return results;
  } catch (error) {
    console.error(`Error querying memory: ${error.message}`);
    return [];
  }
}

module.exports = {
  insertMemory,
  queryMemory
}; 