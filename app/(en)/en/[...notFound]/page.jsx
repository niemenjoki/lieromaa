import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { after } from 'next/server';

import { getCommonMessages } from '@/lib/i18n/messages.mjs';
import { trackNotFound } from '@/lib/looku/next.js';
import { LOOKU_OPTIONS } from '@/lib/looku/options.js';

const copy = getCommonMessages('en').notFound;

export const metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  robots: { index: false, follow: false },
};

export default async function UnknownEnglishPage() {
  // Looku lists the address under missing pages instead of pages. This route is
  // rendered for each request anyway, so reading the headers costs nothing here.
  const requestHeaders = await headers();
  after(() => trackNotFound(requestHeaders, LOOKU_OPTIONS));
  notFound();
}
