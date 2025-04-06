const fs = require('fs');
const path = require('path');
const { loadTools, getTool, getAllTools } = require('../tools/registry');

// Mock the fs module
jest.mock('fs');

describe('Tools Registry', () => {
  const mockTools = [
    {
      name: 'test_tool',
      description: 'Test tool description',
      parameters: {
        type: 'object',
        properties: {
          param1: { type: 'string' }
        },
        required: ['param1']
      },
      endpoint: '/api/tools/test'
    },
    {
      name: 'another_tool',
      description: 'Another test tool',
      parameters: {
        type: 'object',
        properties: {
          optional_param: { type: 'number' }
        }
      },
      endpoint: '/api/tools/another'
    }
  ];

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock file existence check to return true
    fs.existsSync = jest.fn().mockReturnValue(true);
    
    // Mock file read to return our mock tools
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(mockTools));
  });

  describe('loadTools', () => {
    it('should load tools from the json file', () => {
      const tools = loadTools();
      expect(tools).toHaveLength(2);
      expect(tools[0].name).toBe('test_tool');
      expect(tools[1].name).toBe('another_tool');
    });

    it('should return empty array if file does not exist', () => {
      // Override the existsSync mock for this test only
      fs.existsSync = jest.fn().mockReturnValue(false);
      
      const tools = loadTools();
      expect(Array.isArray(tools)).toBe(true);
      expect(tools).toHaveLength(0);
    });

    it('should filter out invalid tools', () => {
      // Create a mock with some invalid tools
      const mixedTools = [
        { name: 'valid_tool', description: 'Valid', parameters: {}, endpoint: '/api/valid' },
        { name: 'invalid_tool' }, // Missing required fields
        { description: 'Invalid', parameters: {} } // Missing name and endpoint
      ];
      
      fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(mixedTools));
      
      const tools = loadTools();
      expect(tools).toHaveLength(1);
      expect(tools[0].name).toBe('valid_tool');
    });
  });

  describe('getTool', () => {
    it('should return a specific tool by name', () => {
      const tool = getTool('test_tool');
      expect(tool).toBeDefined();
      expect(tool.name).toBe('test_tool');
      expect(tool.description).toBe('Test tool description');
    });

    it('should return undefined for a non-existent tool', () => {
      const tool = getTool('nonexistent_tool');
      expect(tool).toBeNull();
    });
  });

  describe('getAllTools', () => {
    it('should return an array of all tools', () => {
      const tools = getAllTools();
      expect(Array.isArray(tools)).toBe(true);
      expect(tools).toHaveLength(2);
      expect(tools[0].name).toBe('test_tool');
    });
  });
}); 