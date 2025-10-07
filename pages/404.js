import Layout from '@/components/Layout';
import Post from '@/components/Post';
import { SITE_URL } from '@/data/vars';
import classNames from '@/styles/NotFoundPage.module.css';
import extractFrontMatter from '@/utils/extractFrontMatter';
import fs from 'fs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import path from 'path';
import { useEffect, useState } from 'react';

const NotFoundPage = ({ posts, keys }) => {
  const router = useRouter();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const runSearch = async () => {
      if (!router.asPath || !posts?.length) {
        return;
      }
      const Fuse = (await import('fuse.js')).default;
      const fuse = new Fuse(posts, {
        includeScore: true,
        minMatchCharLength: 3,
        findAllMatches: true,
        ignoreLocation: true,
        keys,
      });

      const query = router.asPath.replace(/^\//, ''); // strip leading slash
      const searchResults = fuse
        .search(query)
        .filter((r) => r.score < 0.6)
        .slice(0, 3)
        .map((r) => r.item);

      setResults(searchResults);
    };

    runSearch();
  }, [router.asPath, posts, keys]);

  return (
    <Layout title={'404 | Luomuliero'}>
      <div className={classNames.Oops}>Hups!</div>
      <h1 className={classNames.NotFoundPage}>
        Näyttää siltä, että etsimääsi sivua ei ole olemassa
      </h1>
      {results.length > 0 && (
        <>
          <div className={classNames.Suggestion}>
            Ehkä tarkoitit yhtä näistä:
          </div>
          <div className={classNames.Results}>
            {results.map((post, i) => (
              <Post
                key={i}
                post={post}
                compact={true}
                overrideHref={post.overrideHref}
              />
            ))}
          </div>
        </>
      )}
      <div className={classNames.LinkWrapper}>
        <Link href={'/blogi'} className="hover">
          Muut viimeisimmät blogijulkaisut
        </Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

export const getStaticProps = async () => {
  const files = fs.readdirSync('posts');

  const posts = files
    .filter((filename) => filename.substring(0, 5) !== 'draft')
    .map((filename) => {
      const markdownWithMeta = fs.readFileSync(
        path.join('posts', filename),
        'utf-8'
      );
      const { data } = extractFrontMatter(markdownWithMeta);
      const slug = filename.replace('.md', '');

      return {
        slug,
        overrideHref: `/blogi/julkaisu/${slug}`,
        ...data,
      };
    })
    .map((post) => {
      delete post.content;
      delete post.date;
      delete post.structuredData;
      delete post.slug;
      return post;
    });

  const staticPages = [
    {
      overrideHref: '/madot',
      title: 'Osta kompostimatoja',
      excerpt:
        'Tilaa kotimaisia kompostimatoja (Eisenia fetida) helposti postitettuna koko Suomeen. Aloita oma matokomposti Luomulieron madoilla!',
      tags: 'matokompostointi',
      keywords: 'kompostimadot,ostos,luomuliero,madot,myynti',
    },
    {
      overrideHref: '/matolaskuri',
      title: 'Matolaskuri – laske montako matoa tarvitset',
      excerpt:
        'Syötä kotitaloutesi tiedot ja laskuri arvioi biojätteen määrän sekä tarvittavan matopopulaation. Näet myös eri aloitusvaihtoehdot ja kuinka nopeasti pääset täyteen käsittelykapasiteettiin.',
      tags: 'matokompostointi',
      keywords: 'matolaskuri,kompostimadot,laskuri,luomuliero,työkalut',
    },
  ];

  return {
    props: {
      posts: [...posts, ...staticPages],
      keys: [
        { name: 'title', weight: 0.6 },
        { name: 'excerpt', weight: 0.3 },
        { name: 'keywords', weight: 0.1 },
        { name: 'tags', weight: 0.2 },
        { name: 'overrideHref', weight: 0.1 },
      ],
    },
  };
};
