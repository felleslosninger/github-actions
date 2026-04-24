#!/usr/bin/env node
const { execSync } = require('child_process');

const modules = [
  'get-release-notes',
  'validate-pull-request-title',
  'publish-release-notes',
  'github-app-token',
  'write-to-influxdb'
];

console.log('🔍 Checking licenses in all modules...\n');

let failed = false;
const results = [];

for (const module of modules) {
  console.log(`📋 Checking licenses in ${module}...`);
  try {
    execSync(`cd ${module} && npm run lisenssjekk`, { stdio: 'inherit' });
    console.log(`✅ ${module} passed\n`);
    results.push({ module, status: 'passed' });
  } catch (error) {
    console.log(`❌ ${module} failed - found incompatible licenses\n`);
    results.push({ module, status: 'failed' });
    failed = true;
  }
}

console.log('\n📊 License Check Summary:');
console.log('─'.repeat(50));
results.forEach(({ module, status }) => {
  const icon = status === 'passed' ? '✅' : '❌';
  console.log(`${icon} ${module}: ${status}`);
});
console.log('─'.repeat(50));

if (failed) {
  console.log('\n❌ Some modules have incompatible licenses.');
  process.exit(1);
} else {
  console.log('\n✅ All modules have compatible licenses!');
  process.exit(0);
}
