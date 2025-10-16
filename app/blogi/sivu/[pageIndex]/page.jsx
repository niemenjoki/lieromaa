import Link from 'next/link';

import fs from 'fs';
import path from 'path';

import Advert from '@/components/Advert/Advert';
import Pagination from '@/components/Pagination/Pagination';
import Post from '@/components/PostPreview/PostPreview.jsx';
import SearchPosts from '@/components/SearchPosts/SearchPosts.jsx';
import { POSTS_PER_PAGE, SITE_URL } from '@/data/vars.js';
import extractFrontMatter from '@/utils/extractFrontMatter';
import { sortByDate } from '@/utils/index.js';

import classes from './PostPage.module.css';

export async function generateStaticParams() {
  const files = fs.readdirSync('posts');
  const filesWithoutDrafts = files.filter((f) => !f.startsWith('draft'));
  const numPages = Math.ceil(filesWithoutDrafts.length / POSTS_PER_PAGE);
  return Array.from({ length: numPages }, (_, i) => ({
    pageIndex: (i + 1).toString(),
  }));
}

async function getPageData(pageIndex) {
  const currentPage = parseInt(pageIndex) || 1;
  const files = fs.readdirSync('posts').filter((f) => !f.startsWith('draft'));
  const posts = files
    .map((filename) => {
      const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8');
      const { data, content } = extractFrontMatter(markdownWithMeta);
      const slug = filename.replace('.md', '');
      return { slug, ...data, content };
    })
    .sort(sortByDate)
    .map((post) => {
      delete post.date;
      delete post.content;
      return post;
    });

  const numPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pageIdx = currentPage - 1;
  const pagePosts = posts.slice(pageIdx * POSTS_PER_PAGE, (pageIdx + 1) * POSTS_PER_PAGE);

  posts.forEach((post) => {
    const onPage = pagePosts.some((p) => p.slug === post.slug);
    pagePosts.push({ ...post, onPage });
  });

  const uniqueTags = [
    ...new Set(
      posts
        .map((p) => p.tags)
        .join(',')
        .split(',')
    ),
  ];

  return { posts: pagePosts, numPages, currentPage, tags: uniqueTags };
}

export default async function BlogPage({ params, currentPage: override }) {
  const pageIndex = override ?? params?.pageIndex ?? '1';
  const { posts, numPages, currentPage, tags } = await getPageData(pageIndex);

  return (
    <>
      <h1>Viimeisimmät julkaisut</h1>

      <aside
        className={classes.Content}
        style={{
          border: '2px solid var(--highlight)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          backgroundColor: 'var(--background-4)',
        }}
      >
        <h3 style={{ marginTop: 0, color: 'var(--highlight-alt)' }}>Syystarjous 🍂</h3>
        <p style={{ marginBottom: '0.5rem' }}>
          Ilmainen toimitus kaikille kompostimadoille koko Suomeen 30.11.2025 asti.
        </p>
        <Link
          href="/madot-kampanja"
          style={{ fontWeight: 'bold', color: 'var(--highlight-content-link)' }}
        >
          Katso kampanjasivu »
        </Link>
      </aside>

      <SearchPosts
        list={posts}
        keys={['title', 'excerpt', 'keywords', 'tags']}
        placeholder="Etsi julkaisun nimellä tai avainsanalla.."
      />

      <div className={classes.Taglist}>
        <Link href="/" className={`${classes.Tag} ${classes.ActiveTag}`}>
          Kaikki
        </Link>{' '}
        {tags
          .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1))
          .map((tag) => (
            <Link
              href={`/blogi/${tag.toLowerCase().replaceAll(' ', '-')}/sivu/1`}
              key={tag}
              className={classes.Tag}
            >
              {tag}
            </Link>
          ))}
      </div>

      {posts
        .filter((post) => post.onPage === true)
        .map((post, index) => (
          <Post key={index} post={post} />
        ))}

      <Pagination numPages={numPages} currentPage={currentPage} />
      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
    </>
  );
}
