import fs from 'fs';
import path from 'path';

import { CONTENT_TYPES } from '@/data/vars.mjs';

/**
 * Get all content slugs
 */
export function getAllContentSlugs({ type }) {
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

  const files = fs.readdirSync(contentPath);
  return files.filter((f) => fs.statSync(path.join(contentPath, f)).isDirectory());
}
