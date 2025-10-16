import Link from 'next/link';

import fs from 'fs';
import path from 'path';

import Advert from '@/components/Advert/Advert';
import Pagination from '@/components/Pagination/Pagination';
import Post from '@/components/PostPreview/PostPreview';
import SearchPosts from '@/components/SearchPosts/SearchPosts';
import { POSTS_PER_PAGE, SITE_URL } from '@/data/vars';
import extractFrontMatter from '@/utils/extractFrontMatter';
import { sortByDate } from '@/utils/index';

import classes from './TagPage.module.css';

// --- Generate all static paths ---
export async function generateStaticParams() {
  const files = fs.readdirSync('posts');
  const groupedPosts = {};

  files
    .filter((filename) => !filename.startsWith('draft'))
    .forEach((filename) => {
      const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8');
      const { data } = extractFrontMatter(markdownWithMeta);
      const tags = data.tags
        .split(',')
        .map((t) => t.trim().toLowerCase().replaceAll(' ', '-'));
      tags.forEach((tag) => {
        if (!groupedPosts[tag]) groupedPosts[tag] = [];
        groupedPosts[tag].push(filename);
      });
    });

  const params = [];
  for (const tag of Object.keys(groupedPosts)) {
    const numPages = Math.ceil(groupedPosts[tag].length / POSTS_PER_PAGE);
    for (let i = 1; i <= numPages; i++) {
      params.push({ tag, pageIndex: i.toString() });
    }
  }

  return params;
}

// --- Metadata per tag page ---
export async function generateMetadata({ params }) {
  const tagName = params.tag.replaceAll('-', ' ');
  return {
    title: `Blogi: ${tagName} | Luomuliero`,
    description: `Luomulieron blogijulkaisut avainsanalla "${tagName}".`,
    alternates: {
      canonical: `${SITE_URL}/blogi/${params.tag}/sivu/1`,
    },
    openGraph: {
      title: `Blogi: ${tagName} | Luomuliero`,
      description: `Luomulieron blogijulkaisut avainsanalla "${tagName}".`,
      url: `${SITE_URL}/blogi/${params.tag}/sivu/${params.pageIndex}`,
    },
  };
}

// --- Page content ---
export default async function BlogTagPage({ params }) {
  const currentPage = parseInt(params.pageIndex || 1);

  const files = fs.readdirSync('posts');
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

  const postsForTag = posts.filter((post) => {
    const tags = post.tags
      .split(',')
      .map((t) => t.trim().toLowerCase().replaceAll(' ', '-'));
    return tags.includes(params.tag);
  });

  const numPages = Math.ceil(postsForTag.length / POSTS_PER_PAGE);
  const pageIndex = currentPage - 1;
  const pagePosts = postsForTag.slice(
    pageIndex * POSTS_PER_PAGE,
    (pageIndex + 1) * POSTS_PER_PAGE
  );

  posts.forEach((post) => {
    const matchIndex = pagePosts.findIndex((p) => p.slug === post.slug);
    if (matchIndex !== -1) {
      pagePosts[matchIndex].onPage = true;
    } else {
      const clone = { ...post, onPage: false };
      pagePosts.push(clone);
    }
  });

  const uniqueTags = [
    ...new Set(
      posts
        .map((p) => p.tags)
        .join(',')
        .split(',')
        .map((t) => t.trim())
    ),
  ];

  const tagDisplay = params.tag.replaceAll('-', ' ');

  return (
    <>
      <h1>Julkaisut avainsanalla &quot;{tagDisplay}&quot;</h1>

      <SearchPosts
        list={pagePosts}
        keys={['title', 'excerpt', 'keywords', 'tags']}
        placeholder="Etsi julkaisun nimellä tai avainsanalla.."
      />

      <div className={classes.Taglist}>
        <Link href="/blogi" className={classes.Tag}>
          Kaikki
        </Link>
        {uniqueTags
          .sort((a, b) => a.localeCompare(b))
          .map((t) => {
            const isActive =
              t.toLowerCase().replaceAll(' ', '-') === params.tag.toLowerCase();
            return (
              <Link
                key={t}
                href={`/blogi/${t.toLowerCase().replaceAll(' ', '-')}/sivu/1`}
                className={`${classes.Tag} ${isActive ? classes.ActiveTag : ''}`}
              >
                {t}
              </Link>
            );
          })}
      </div>

      {pagePosts
        .filter((p) => p.onPage)
        .map((post, i) => (
          <Post key={i} post={post} />
        ))}

      <Pagination numPages={numPages} currentPage={currentPage} />
      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
    </>
  );
}
