#!/usr/bin/env node
const { execSync } = require('child_process');

const modules = [
  'get-release-notes',
  'validate-pull-request-title',
  'publish-release-notes',
  'github-app-token',
  'write-to-influxdb'
];

console.log('🔍 Checking for changed modules...\n');

// Get changed files
let changedFiles;
try {
  changedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);
} catch (error) {
  console.error('❌ Error getting changed files:', error.message);
  process.exit(1);
}

if (changedFiles.length === 0) {
  console.log('✅ No files staged for commit');
  process.exit(0);
}

// Find which modules have changes
const changedModules = new Set(
  changedFiles
    .map(file => file.split('/')[0])
    .filter(module => modules.includes(module))
);

if (changedModules.size === 0) {
  console.log('✅ No TypeScript/Node.js modules changed');
  process.exit(0);
}

console.log('📦 Changed modules:', Array.from(changedModules).join(', '));
console.log('');

// Lint each changed module
let failed = false;
for (const module of changedModules) {
  console.log(`🔍 Linting ${module}...`);
  try {
    execSync(`cd ${module} && npm run lint`, { stdio: 'inherit' });
    console.log(`✅ ${module} passed\n`);
  } catch (error) {
    console.log(`❌ ${module} failed\n`);
    failed = true;
  }
}

if (failed) {
  console.log('❌ Linting failed. Please fix the errors before committing.');
  process.exit(1);
} else {
  console.log('✅ All changed modules passed linting!');
  process.exit(0);
}
