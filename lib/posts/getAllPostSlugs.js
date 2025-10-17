import fs from 'fs';
import path from 'path';

/**
 * Get all post directories
 */
export function getAllPostSlugs() {
  const files = fs.readdirSync('posts');
  return files
    .filter(
      (f) => !f.startsWith('draft') && fs.statSync(path.join('posts', f)).isDirectory()
    )
    .map((f) => f);
}
