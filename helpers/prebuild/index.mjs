import { execSync } from 'child_process';

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

try {
  run('node helpers/prebuild/generateSafeRoutes.mjs');
  run('node helpers/prebuild/optimizeImages.mjs');
  run('node helpers/prebuild/generateSafeImagePaths.mjs');
} catch (err) {
  process.exit(1);
}
