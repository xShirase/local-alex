module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'index.js',
    'memory/**/*.js',
    'tools/**/*.js'
  ],
  coverageDirectory: './coverage',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  restoreMocks: true,
}; 