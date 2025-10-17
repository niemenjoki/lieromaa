import ClientNotFoundPage from '@/components/NotFoundClient/NotFoundClient';
import { getAllPosts } from '@/lib/posts';

export default async function NotFound() {
  const posts = getAllPosts();

  const staticPages = [
    {
      overrideHref: '/madot',
      title: 'Osta kompostimatoja',
      excerpt:
        'Tilaa kotimaisia kompostimatoja (Eisenia fetida) helposti postitettuna koko Suomeen.',
      tags: ['matokompostointi'],
      keywords: ['kompostimadot', 'ostos', 'luomuliero', 'madot', 'myynti'],
    },
    {
      overrideHref: '/matolaskuri',
      title: 'Matolaskuri - laske montako matoa tarvitset',
      excerpt:
        'Syötä kotitaloutesi tiedot ja laskuri arvioi biojätteen määrän sekä tarvittavan matopopulaation.',
      tags: ['matokompostointi'],
      keywords: ['matolaskuri', 'kompostimadot', 'laskuri', 'luomuliero', 'työkalut'],
    },
  ];

  return <ClientNotFoundPage posts={[...posts, ...staticPages]} />;
}
