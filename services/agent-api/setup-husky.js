const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create .husky directory if it doesn't exist
const huskyDir = path.join(__dirname, '.husky');
if (!fs.existsSync(huskyDir)) {
  fs.mkdirSync(huskyDir, { recursive: true });
  console.log('Created .husky directory');
}

// Initialize husky
try {
  execSync('npx husky install', { stdio: 'inherit' });
  console.log('Initialized husky');
} catch (error) {
  console.error('Failed to initialize husky:', error);
  process.exit(1);
}

// Create pre-commit hook
const preCommitPath = path.join(huskyDir, 'pre-commit');
const preCommitContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

cd services/agent-api && npm test
`;

fs.writeFileSync(preCommitPath, preCommitContent, { mode: 0o755 });
console.log('Created pre-commit hook');

console.log('Husky setup complete!'); 