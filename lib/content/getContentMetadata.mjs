import fs from 'fs';
import path from 'path';

import { CONTENT_TYPES } from '../../data/vars.mjs';
import { createContentStructuredData } from '../structuredData/createContentStructuredData.mjs';

/**
 * Get metadata for a single piece of content
 */
export function getContentMetadata({ type, slug }) {
  let contentPath = '';
  if (type === CONTENT_TYPES.POST) {
    contentPath = path.join(process.cwd(), 'content', 'posts');
  } else if (type === CONTENT_TYPES.GUIDE) {
    contentPath = path.join(process.cwd(), 'content', 'guides');
  } else {
    throw new Error(
      `getAllPostSlugs got an invalid parameter type: "${type}", expected one of ${Object.keys(CONTENT_TYPES).join(', ')}`
    );
  }

  const contentDir = path.join(contentPath, slug);
  const metadataPath = path.join(contentDir, 'data.json');

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

  metadata.slug = slug;
  metadata.structuredData = createContentStructuredData({
    type,
    slug,
    content: metadata,
  });

  return metadata;
}
