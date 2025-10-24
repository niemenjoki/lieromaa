'use client';

import React from 'react';

import Image from 'next/image';

import safePaths from '@/data/generated/safeImagePaths.json';

function isSafeHref(src) {
  return safePaths.includes(src);
}

export default function SafeImage({ src, ...props }) {
  if (typeof src !== 'string') {
    throw new Error(`SafeImage: src must be a string, got ${typeof src}`);
  }

  if (!isSafeHref(src)) {
    throw new Error(`Unsafe image path blocked: "${src}"`);
  }

  return <Image src={src} {...props} />
 
}
