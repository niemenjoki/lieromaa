const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BLOGPOST_IMAGES = path.join(__dirname, '../public/images/posts');
const WORMSPAGE_IMAGES = path.join(__dirname, '../public/images/wormspage');
const PUBLIC_IMAGES_ROOT = path.join(__dirname, '../public/images');
const CACHE_ROOT = path.join(__dirname, '../.vercel/cache/images');

const sizes = [800, 1200];
const formats = ['avif', 'webp', 'jpg'];
const MAX_SIZE = Math.max(...sizes);

const colors = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  gray: (s) => `\x1b[90m${s}\x1b[0m`,
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function getPngs(dir) {
  if (!fs.existsSync(dir)) return [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  return list.flatMap((f) => {
    const full = path.join(dir, f.name);
    return f.isDirectory() ? getPngs(full) : /\.png$/i.test(f.name) ? [full] : [];
  });
}

function deepCopy(srcDir, dstDir) {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const src = path.join(srcDir, e.name);
    const dst = path.join(dstDir, e.name);
    if (e.isDirectory()) {
      deepCopy(src, dst);
    } else {
      ensureDir(path.dirname(dst));
      if (!fs.existsSync(dst)) fs.copyFileSync(src, dst);
    }
  }
}

(async () => {
  console.log(colors.gray('\n--- Image generation started ---'));
  ensureDir(CACHE_ROOT);

  const pngs = [...getPngs(BLOGPOST_IMAGES), ...getPngs(WORMSPAGE_IMAGES)];

  let totalGenerated = 0;
  let totalRestored = 0;
  let totalResized = 0;

  for (const imgPath of pngs) {
    const { dir, name, ext } = path.parse(imgPath);
    const rel = path.relative(PUBLIC_IMAGES_ROOT, dir);
    const cacheDir = path.join(CACHE_ROOT, rel);
    ensureDir(cacheDir);

    console.log(`\n${colors.yellow(name + ext)}..`);

    // A) Resize originals >1200px
    try {
      const meta = await sharp(imgPath).metadata();
      if ((meta.width || 0) > MAX_SIZE) {
        const tmp = path.join(dir, `${name}-tmp${ext}`);
        await sharp(imgPath)
          .resize({
            width: MAX_SIZE,
            withoutEnlargement: true,
            kernel: sharp.kernel.lanczos3,
          })
          .png({ compressionLevel: 9 })
          .toFile(tmp);
        fs.renameSync(tmp, imgPath);
        totalResized++;
        console.log(`- ${colors.green('✅ Original resized to ≤1200px')}`);
      }
    } catch (e) {
      console.log(
        `- ${colors.red('⚠ Failed to read/resize original')} ${colors.gray(e.message)}`
      );
    }

    // B) Define expected variants
    const expected = [];
    for (const size of sizes) {
      for (const format of formats) {
        expected.push({
          outFile: path.join(dir, `${name}-${size}.${format}`),
          cacheFile: path.join(cacheDir, `${name}-${size}.${format}`),
          label: `${size}px ${format}`,
        });
      }
    }

    // Record what exists BEFORE restoring
    const beforeState = new Set(
      expected.filter(({ outFile }) => fs.existsSync(outFile)).map((v) => v.outFile)
    );

    // C) Restore missing ones from cache
    let restoredCount = 0;
    for (const { outFile, cacheFile } of expected) {
      if (!fs.existsSync(outFile) && fs.existsSync(cacheFile)) {
        ensureDir(path.dirname(outFile));
        fs.copyFileSync(cacheFile, outFile);
      }
    }

    // Determine how many were restored (appeared after copy)
    for (const { outFile } of expected) {
      if (!beforeState.has(outFile) && fs.existsSync(outFile)) restoredCount++;
    }

    // D) Generate any still missing
    let generatedCount = 0;
    const generatedLabels = [];
    for (const { outFile, cacheFile, label } of expected) {
      if (!fs.existsSync(outFile)) {
        await sharp(imgPath)
          .resize(parseInt(label, 10))
          .toFormat(path.parse(cacheFile).ext.slice(1))
          .toFile(outFile);
        ensureDir(path.dirname(cacheFile));
        fs.copyFileSync(outFile, cacheFile);
        generatedCount++;
        generatedLabels.push(label);
      }
    }

    // E) Logging
    if (generatedCount === 0 && restoredCount === 0) {
      console.log(`- ${colors.green('✅ Already up to date')}`);
    } else if (generatedCount === 0 && restoredCount > 0) {
      console.log(`- ${colors.green('✅ Restored from cache')}`);
    } else {
      console.log(`- ${colors.red('❌ Not found in cache')}`);
      for (const label of generatedLabels) {
        console.log(`  ${colors.green(`✅ ${label} generated`)}`);
      }
    }

    totalGenerated += generatedCount;
    totalRestored += restoredCount;
  }

  console.log(
    `\n${colors.gray('--- Image generation complete ---')}\n` +
      `${colors.green(`✔ ${totalGenerated} new versions generated`)}\n` +
      `${colors.yellow(`↺ ${totalRestored} restored from cache`)}\n` +
      `${colors.gray(`ℹ ${totalResized} originals resized to ≤1200px`)}\n`
  );
})();
