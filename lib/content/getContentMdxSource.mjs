import fs from 'fs';
import path from 'path';

import { getContentDirectory } from './getContentDirectory.mjs';

export function getContentMdxSource({ type, slug }) {
  const contentDir = getContentDirectory({ type, slug });
  const mdxPath = path.join(contentDir, 'content.mdx');

  if (!fs.existsSync(mdxPath)) {
    throw new Error(`No content.mdx found for content: ${slug}`);
  }

  return fs.readFileSync(mdxPath, 'utf-8');
}
