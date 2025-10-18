const { testPostMetadata } = require('./testPostMetadata');
const { testPostLinks } = require('./testPostLinks');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
};

(async () => {
  console.log(
    `${colors.cyan}${colors.bold}🔍 Running Lieromaa test suite...${colors.reset}\n`
  );
  const tests = [testPostMetadata, testPostLinks];
  for (const test of tests) await test();
  console.log(`${colors.green}${colors.bold}✅  All tests completed.${colors.reset}\n`);
})();
