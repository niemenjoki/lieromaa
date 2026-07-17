import { notFound } from 'next/navigation';

import { getCommonMessages } from '@/lib/i18n/messages.mjs';

const copy = getCommonMessages('en').notFound;

export const metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  robots: { index: false, follow: false },
};

export default function UnknownEnglishPage() {
  notFound();
}
