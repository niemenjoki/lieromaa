import path from 'path';

import { CONTENT_TYPES } from '../site/constants.mjs';

export function getContentDirectory({ type, slug }) {
  let contentPath = '';

  if (type === CONTENT_TYPES.POST) {
    contentPath = path.join(process.cwd(), 'content', 'posts');
  } else if (type === CONTENT_TYPES.GUIDE) {
    contentPath = path.join(process.cwd(), 'content', 'guides');
  } else {
    throw new Error(
      `getContentDirectory got an invalid parameter type: "${type}", expected one of ${Object.keys(CONTENT_TYPES).join(', ')}`
    );
  }

  return path.join(contentPath, slug);
}
