import fs from 'fs';
import path from 'path';

import { CONTENT_TYPES } from '../../data/vars.mjs';
import { createContentStructuredData } from '../structuredData/createContentStructuredData.mjs';
import { getContentDirectory } from './getContentDirectory.mjs';

/**
 * Get metadata for a single piece of content
 */
export function getContentMetadata({ type, slug }) {
  if (!Object.values(CONTENT_TYPES).includes(type)) {
    throw new Error(
      `getContentMetadata got an invalid parameter type: "${type}", expected one of ${Object.keys(CONTENT_TYPES).join(', ')}`
    );
  }

  const contentDir = getContentDirectory({ type, slug });
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
