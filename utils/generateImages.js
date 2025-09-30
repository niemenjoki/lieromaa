const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BLOGPOST_IMAGES = path.join(__dirname, '../public/images/posts');
const WORMSPAGE_IMAGES = path.join(__dirname, '../public/images/wormspage');
const sizes = [800, 1200];
const formats = ['avif', 'webp', 'jpg'];
const maxSize = Math.max(...sizes); // largest version needed

// Recursively get PNG images
function getImages(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  list.forEach((file) => {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(getImages(fullPath));
    } else if (/\.(png)$/i.test(file.name)) {
      results.push(fullPath);
    }
  });
  return results;
}

(async () => {
  const images = [
    ...getImages(BLOGPOST_IMAGES),
    ...getImages(WORMSPAGE_IMAGES),
  ];

  for (const imgPath of images) {
    const { dir, name, ext } = path.parse(imgPath);

    // Generate multiple formats/sizes
    for (const size of sizes) {
      for (const format of formats) {
        const outFile = path.join(dir, `${name}-${size}.${format}`);
        if (!fs.existsSync(outFile)) {
          console.log(`Generating: ${path.basename(outFile)}`);
          await sharp(imgPath).resize(size).toFormat(format).toFile(outFile);
        }
      }
    }

    // Replace the original only in dev
    if (process.env.NODE_ENV === 'development') {
      const tmpFile = path.join(dir, `${name}-tmp${ext}`);
      console.log(
        `Replacing original with max ${maxSize}px version: ${path.basename(
          imgPath
        )}`
      );
      await sharp(imgPath)
        .resize({
          width: maxSize,
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3,
        })
        .png({ compressionLevel: 9 })
        .toFile(tmpFile);

      fs.renameSync(tmpFile, imgPath);
    } else {
      console.log(
        `Skipping original replacement in production: ${path.basename(imgPath)}`
      );
    }
  }

  console.log('Image generation complete.');
})();
