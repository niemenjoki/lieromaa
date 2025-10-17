import fs from 'fs';
import path from 'path';

/**
 * Get metadata for a single post
 */
export function getPostMetadata(slug) {
  const postDir = path.join(process.cwd(), 'posts', slug);
  const metadataPath = path.join(postDir, 'data.json');
  const structuredDataPath = path.join(postDir, 'structuredData.json');

  if (!fs.existsSync(metadataPath)) {
    throw new Error(`No data.json found for post: ${slug}`);
  }

  let metadata;
  try {
    const raw = fs.readFileSync(metadataPath, 'utf-8');
    metadata = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse data.json for post: ${slug} - ${err.message}`);
  }

  if (fs.existsSync(structuredDataPath)) {
    try {
      const raw = fs.readFileSync(structuredDataPath, 'utf-8');
      const structuredData = JSON.parse(raw);
      metadata.structuredData = structuredData;
    } catch (err) {
      console.warn(
        `Failed to parse structuredData.json for post: ${slug} - ${err.message}`
      );
    }
  } else {
    console.warn(`No structuredData.json found for post: ${slug}`);
  }
  metadata.slug = slug;
  return metadata;
}
