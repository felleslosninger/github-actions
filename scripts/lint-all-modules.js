#!/usr/bin/env node
const { execSync } = require('child_process');

const modules = [
  'get-release-notes',
  'validate-pull-request-title',
  'publish-release-notes',
  'github-app-token',
  'write-to-influxdb'
];

console.log('🔍 Linting all modules...\n');

let failed = false;
const results = [];

for (const module of modules) {
  console.log(`🔍 Linting ${module}...`);
  try {
    execSync(`cd ${module} && npm run lint`, { stdio: 'inherit' });
    console.log(`✅ ${module} passed\n`);
    results.push({ module, status: 'passed' });
  } catch (error) {
    console.log(`❌ ${module} failed\n`);
    results.push({ module, status: 'failed' });
    failed = true;
  }
}

console.log('\n📊 Summary:');
console.log('─'.repeat(50));
results.forEach(({ module, status }) => {
  const icon = status === 'passed' ? '✅' : '❌';
  console.log(`${icon} ${module}: ${status}`);
});
console.log('─'.repeat(50));

if (failed) {
  console.log('\n❌ Some modules failed linting.');
  process.exit(1);
} else {
  console.log('\n✅ All modules passed linting!');
  process.exit(0);
}
