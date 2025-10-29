import fs from 'fs';
import path from 'path';

import { CONTENT_TYPES } from '../../data/vars.mjs';

/**
 * Get metadata for a single piece of content
 */
export function getContentMetadata({ type, slug }) {
  let contentPath = '';
  if (type === CONTENT_TYPES.POST) {
    contentPath = 'posts';
  } else if (type === CONTENT_TYPES.GUIDE) {
    contentPath = 'guides';
  } else {
    throw new Error(
      `getAllPostSlugs got an invalid parameter type: "${type}", expected one of ${Object.keys(CONTENT_TYPES).join(', ')}`
    );
  }

  const contentDir = path.join(process.cwd(), contentPath, slug);
  const metadataPath = path.join(contentDir, 'data.json');
  const structuredDataPath = path.join(contentDir, 'structuredData.json');

  if (!fs.existsSync(metadataPath)) {
    throw new Error(`No data.json found for content: ${slug}`);
  }

  let metadata;
  try {
    const raw = fs.readFileSync(metadataPath, 'utf-8');
    metadata = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to parse data.json for content: ${slug} - ${err.message}`);
  }

  if (fs.existsSync(structuredDataPath)) {
    try {
      const raw = fs.readFileSync(structuredDataPath, 'utf-8');
      const structuredData = JSON.parse(raw);
      metadata.structuredData = structuredData;
    } catch (err) {
      console.warn(
        `Failed to parse structuredData.json for content: ${slug} - ${err.message}`
      );
    }
  } else {
    console.warn(`No structuredData.json found for content: ${slug}`);
  }
  metadata.slug = slug;
  return metadata;
}
