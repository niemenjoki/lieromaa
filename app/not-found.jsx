import fs from 'fs';
import path from 'path';

import ClientNotFoundPage from '@/components/NotFoundClient/NotFoundClient';
import extractFrontMatter from '@/utils/extractFrontMatter';

export default async function NotFound() {
  const files = fs.readdirSync('posts');
  const posts = files
    .filter((filename) => !filename.startsWith('draft'))
    .map((filename) => {
      const markdown = fs.readFileSync(path.join('posts', filename), 'utf-8');
      const { data } = extractFrontMatter(markdown);
      const slug = filename.replace('.md', '');
      return {
        overrideHref: `/blogi/julkaisu/${slug}`,
        ...data,
      };
    })
    .map((post) => {
      delete post.content;
      delete post.date;
      delete post.structuredData;
      return post;
    });

  const staticPages = [
    {
      overrideHref: '/madot',
      title: 'Osta kompostimatoja',
      excerpt:
        'Tilaa kotimaisia kompostimatoja (Eisenia fetida) helposti postitettuna koko Suomeen.',
      tags: 'matokompostointi',
      keywords: 'kompostimadot,ostos,luomuliero,madot,myynti',
    },
    {
      overrideHref: '/matolaskuri',
      title: 'Matolaskuri – laske montako matoa tarvitset',
      excerpt:
        'Syötä kotitaloutesi tiedot ja laskuri arvioi biojätteen määrän sekä tarvittavan matopopulaation.',
      tags: 'matokompostointi',
      keywords: 'matolaskuri,kompostimadot,laskuri,luomuliero,työkalut',
    },
  ];

  return <ClientNotFoundPage posts={[...posts, ...staticPages]} />;
}
