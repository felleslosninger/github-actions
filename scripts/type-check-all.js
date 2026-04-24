#!/usr/bin/env node
const { execSync } = require('child_process');

const modules = [
  'get-release-notes',
  'validate-pull-request-title',
  'publish-release-notes',
  'github-app-token',
  'write-to-influxdb'
];

console.log('🔍 Type checking all modules...\n');

let failed = false;
const results = [];

for (const module of modules) {
  console.log(`🔍 Type checking ${module}...`);
  try {
    execSync(`cd ${module} && npx tsc --noEmit`, { stdio: 'inherit' });
    console.log(`✅ ${module} passed\n`);
    results.push({ module, status: 'passed' });
  } catch (error) {
    console.log(`❌ ${module} has type errors\n`);
    results.push({ module, status: 'failed' });
    failed = true;
  }
}

console.log('\n📊 Type Check Summary:');
console.log('─'.repeat(50));
results.forEach(({ module, status }) => {
  const icon = status === 'passed' ? '✅' : '❌';
  console.log(`${icon} ${module}: ${status}`);
});
console.log('─'.repeat(50));

if (failed) {
  console.log('\n❌ Some modules have type errors.');
  process.exit(1);
} else {
  console.log('\n✅ All modules passed type checking!');
  process.exit(0);
}
