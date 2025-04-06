const fs = require('fs');
const path = require('path');

/**
 * Load available tools from the tools.json file
 * @returns {Array} Array of tool definitions
 */
function loadTools() {
  try {
    // Determine the path to tools.json
    const toolsPath = path.join(__dirname, 'tools.json');
    
    // Check if the file exists
    if (!fs.existsSync(toolsPath)) {
      console.warn(`Tools file not found at ${toolsPath}, returning empty tools array`);
      return [];
    }
    
    // Read and parse the tools definition file
    const toolsData = fs.readFileSync(toolsPath, 'utf8');
    const tools = JSON.parse(toolsData);
    
    console.log(`Loaded ${tools.length} tools from registry`);
    
    // Validate the tools format
    const validatedTools = tools.filter(tool => {
      const isValid = 
        tool.name && 
        tool.description && 
        tool.parameters &&
        tool.endpoint;
        
      if (!isValid) {
        console.warn(`Skipping invalid tool definition: ${JSON.stringify(tool)}`);
      }
      
      return isValid;
    });
    
    if (validatedTools.length !== tools.length) {
      console.warn(`Filtered out ${tools.length - validatedTools.length} invalid tool definitions`);
    }
    
    return validatedTools;
  } catch (error) {
    console.error(`Error loading tools: ${error.message}`);
    return [];
  }
}

/**
 * Get a specific tool by name
 * @param {string} name - The name of the tool to find
 * @returns {Object|null} The tool definition or null if not found
 */
function getTool(name) {
  const tools = loadTools();
  return tools.find(tool => tool.name === name) || null;
}

/**
 * Get all available tools
 * @returns {Array} Array of all tool definitions
 */
function getAllTools() {
  return loadTools();
}

module.exports = {
  loadTools,
  getTool,
  getAllTools
}; 