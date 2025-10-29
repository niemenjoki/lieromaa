import safeLinks from '@/data/generated/safeRoutes.json';
import { getAllPosts, getAllTags, getPaginatedPosts, getPostsByTag } from '@/lib/posts';

import { POSTS_PER_PAGE, SITE_URL } from '../data/vars.mjs';

function toISODate(d) {
  return new Date(d).toISOString().split('T')[0];
}

export const revalidate = 3600;

export default async function sitemap() {
  const urls = [];

  const posts = getAllPosts();
  const tags = getAllTags();

  const latestPost = posts.reduce((latest, post) => {
    const current = new Date(post.date);
    return current > latest ? current : latest;
  }, new Date(0));

  const staticPages = [
    { url: '/', lastmod: latestPost },
    { url: '/tietoa', lastmod: '2025-09-08' },
    { url: '/tietosuoja', lastmod: '2025-09-08' },
    { url: '/tilausehdot', lastmod: '2025-10-07' },
    { url: '/tuotteet/madot', lastmod: '2025-10-07' },
    { url: '/matolaskuri', lastmod: '2025-10-07' },
    { url: '/tuotteet/madot-kampanja', lastmod: '2025-10-14' },
  ];

  for (const { url, lastmod } of staticPages) {
    urls.push({
      url: `${SITE_URL}${url}`,
      lastModified: toISODate(lastmod),
    });
  }

  for (const tag of tags) {
    const { numPages } = getPostsByTag(tag.replaceAll(' ', '-'), 1, POSTS_PER_PAGE);
    for (let i = 1; i <= numPages; i++) {
      urls.push({
        url: `${SITE_URL}/blogi/${tag.replaceAll(' ', '-').trim()}/sivu/${i}`,
        lastModified: toISODate(latestPost),
      });
    }
  }

  for (const post of posts) {
    urls.push({
      url: `${SITE_URL}/blogi/julkaisu/${post.slug}`,
      lastModified: toISODate(post.date),
    });
  }

  const pageCount = Math.ceil(posts.length / POSTS_PER_PAGE);
  for (let i = 2; i <= pageCount; i++) {
    urls.push({
      url: `${SITE_URL}/blogi/sivu/${i}`,
      lastModified: toISODate(latestPost),
    });
  }

  for (const url of urls) {
    const path = url.url.replace(SITE_URL, '');
    if (!safeLinks.includes(path)) {
      throw new Error(`Invalid url defined in sitemap: "${path}"`);
    }
  }

  return urls.sort((a, b) => a.url.localeCompare(b.url));
}
