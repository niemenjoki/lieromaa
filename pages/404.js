import Layout from '@/components/Layout';
import Post from '@/components/Post';
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
              <Post key={i} post={post} compact={true} />
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
        url: `/post/${slug}`, // add full path for search
        ...data,
      };
    })
    .map((post) => {
      delete post.content;
      delete post.date;
      return post;
    });

  return {
    props: {
      posts,
      keys: ['title', 'excerpt', 'keywords', 'tags', 'url'], // include url in Fuse search
    },
  };
};
