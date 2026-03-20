'use client';

import Image from 'next/image';

import safePaths from '@/generated/site/safeImagePaths.json';

const safePathSet = new Set(safePaths);
const safeBasenameCounts = safePaths.reduce((counts, safePath) => {
  const basename = safePath.split('/').pop();

  if (basename) {
    counts.set(basename, (counts.get(basename) ?? 0) + 1);
  }

  return counts;
}, new Map());

function getBundledBasename(src) {
  const fileName = src.split('/').pop();

  if (!fileName) {
    return null;
  }

  const match = fileName.match(/^(.*)\.[^.]+\.(avif|webp|jpg|jpeg|png|svg)$/i);

  if (!match) {
    return null;
  }

  return `${match[1]}.${match[2].toLowerCase()}`;
}

function isSafeSrc(src, safePath) {
  if (safePath && src.startsWith('/_next/static/media/')) {
    return safePathSet.has(safePath);
  }

  if (safePathSet.has(src)) {
    return true;
  }

  if (!src.startsWith('/_next/static/media/')) {
    return false;
  }

  const bundledBasename = getBundledBasename(src);

  if (!bundledBasename) {
    return false;
  }

  return safeBasenameCounts.get(bundledBasename) === 1;
}

export default function SafeImage({ src, alt, safePath, ...props }) {
  let actualSrc;

  if (typeof src === 'string') {
    actualSrc = src;
  } else if (src && typeof src === 'object' && 'src' in src) {
    actualSrc = src.src;
  } else {
    throw new Error(
      `SafeImage: expected src to be a string or static import, got ${typeof src}`
    );
  }

  if (!isSafeSrc(actualSrc, safePath)) {
    throw new Error(`Unsafe image path blocked: "${actualSrc}"`);
  }

  return <Image src={src} alt={alt} {...props} />;
}
