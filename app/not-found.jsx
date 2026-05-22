import ClientNotFoundPage from '@/components/NotFoundClient/NotFoundClient';
import { getSiteSearchIndex } from '@/lib/search/siteSearchIndex.mjs';

export const metadata = {
  title: 'Sivua ei löytynyt | Lieromaa',
  description: 'Hakemaasi sivua ei löytynyt. Hae sivustolta tai selaa oppaita.',
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const searchItems = getSiteSearchIndex();

  return <ClientNotFoundPage searchItems={searchItems} />;
}
