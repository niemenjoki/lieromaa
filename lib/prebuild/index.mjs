import { execSync } from 'child_process';

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

try {
  run('node lib/prebuild/generateSafeRoutes.mjs');
  run('node lib/prebuild/optimizeImages.mjs');
  run('node lib/prebuild/generateSafeImagePaths.mjs');
  run('node lib/prebuild/verifyMetadata.mjs');
} catch (err) {
  process.exit(1);
}
