import fs from 'fs';
import path from 'path';

import { getContentDirectory } from './getContentDirectory.mjs';

export function getContentMdxSource({ type, slug }) {
  const contentDir = getContentDirectory({ type, slug });
  const mdxPath = path.join(contentDir, 'body.mdx');

  if (!fs.existsSync(mdxPath)) {
    throw new Error(`No body.mdx found for content: ${slug}`);
  }

  return fs.readFileSync(mdxPath, 'utf-8');
}
