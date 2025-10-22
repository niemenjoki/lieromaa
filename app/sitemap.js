import { getAllPosts, getAllTags } from '@/lib/posts';

import { SITE_URL } from '../data/vars';

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
    { url: '/madot', lastmod: '2025-10-07' },
    { url: '/matolaskuri', lastmod: '2025-10-07' },
    { url: '/madot-kampanja', lastmod: '2025-10-14' },
  ];

  for (const { url, lastmod } of staticPages) {
    urls.push({
      url: `${SITE_URL}${url}`,
      lastModified: toISODate(lastmod),
    });
  }

  for (const tag of tags) {
    urls.push({
      url: `${SITE_URL}/blogi/${tag.replaceAll(' ', '-').trim()}/sivu/1`,
      lastModified: toISODate(latestPost),
    });
  }

  for (const post of posts) {
    urls.push({
      url: `${SITE_URL}/blogi/julkaisu/${post.slug}`,
      lastModified: toISODate(post.date),
    });
  }

  return urls;
}
