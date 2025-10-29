import ClientNotFoundPage from '@/components/NotFoundClient/NotFoundClient';
import { CONTENT_TYPES } from '@/data/vars.mjs';
import { getAllContent } from '@/lib/content';

export const metadata = {
  title: 'Sivua ei löytynyt | Lieromaa',
  description: 'Hakemaasi sivua ei löytynyt. Palaa etusivulle tai selaa blogia.',
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const posts = getAllContent({ type: CONTENT_TYPES.POST });

  const staticPages = [
    {
      overrideHref: '/tuotteet/madot',
      title: 'Osta kompostimatoja',
      excerpt:
        'Tilaa kotimaisia kompostimatoja (Eisenia fetida) helposti postitettuna koko Suomeen.',
      tags: ['matokompostointi'],
      keywords: ['kompostimadot', 'ostos', 'lieromaa', 'madot', 'myynti'],
    },
    {
      overrideHref: '/matolaskuri',
      title: 'Matolaskuri - laske montako matoa tarvitset',
      excerpt:
        'Syötä kotitaloutesi tiedot ja laskuri arvioi biojätteen määrän sekä tarvittavan matopopulaation.',
      tags: ['matokompostointi'],
      keywords: ['matolaskuri', 'kompostimadot', 'laskuri', 'lieromaa', 'työkalut'],
    },
  ];

  return <ClientNotFoundPage posts={[...posts, ...staticPages]} />;
}
