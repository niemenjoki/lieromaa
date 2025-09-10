const fs = require('fs');
const path = require('path');

const PUBLIC_IMAGES = path.join(__dirname, '../public/images/posts');
const POSTS_DIR = path.join(__dirname, '../posts');
const sizes = [800, 1200];
const DEFAULT_CONTENT_WIDTH = 800; // adjust to your content area max-width in px

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

// Recursively get Markdown files
function getMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  list.forEach((file) => {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(getMarkdownFiles(fullPath));
    } else if (/\.(md|mdx)$/i.test(file.name)) {
      results.push(fullPath);
    }
  });
  return results;
}

// Generate <picture> HTML with sizes attribute
function generatePictureHTML(imgFullPath, alt) {
  const { dir, name } = path.parse(imgFullPath);
  const relativeDir = path.relative(PUBLIC_IMAGES, dir).replace(/\\/g, '/');
  const base = `/images/posts/${relativeDir}/${name}`;

  // Example sizes: full width on small screens, max 800px on larger screens
  const sizesAttr = `(max-width: 600px) 100vw, ${DEFAULT_CONTENT_WIDTH}px`;

  return `<picture>
  <source srcset="${sizes
    .map((s) => `${base}-${s}.avif ${s}w`)
    .join(', ')}" type="image/avif">
  <source srcset="${sizes
    .map((s) => `${base}-${s}.webp ${s}w`)
    .join(', ')}" type="image/webp">
  <img src="${base}-800.jpg" srcset="${sizes
    .map((s) => `${base}-${s}.jpg ${s}w`)
    .join(
      ', '
    )}" alt="${alt}" sizes="${sizesAttr}" style="max-width:100%;height:auto;" loading="lazy">
</picture>`;
}

(async () => {
  // Replace placeholders in Markdown
  const images = getImages(PUBLIC_IMAGES);
  const mdFiles = getMarkdownFiles(POSTS_DIR);
  for (const file of mdFiles) {
    let content = fs.readFileSync(file, 'utf8');

    content = content.replace(
      /\[\[image:(.+?)\|alt=(.+?)\]\]/g,
      (match, imgFile, altText) => {
        // Find the image in public images (recursive)
        const foundImg = images.find((p) => p.endsWith(imgFile));
        if (!foundImg) {
          console.warn(`Image not found: ${imgFile} in ${file}`);
          return match; // leave placeholder if missing
        }
        return generatePictureHTML(foundImg, altText);
      }
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
})();
