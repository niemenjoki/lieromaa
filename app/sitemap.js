import fs from 'fs/promises';
import path from 'path';

import { SITE_URL } from '../data/vars';
import extractFrontMatter from '../utils/extractFrontMatter';

function toISODate(d) {
  return d.toISOString().split('T')[0];
}

export const revalidate = 3600;

export default async function sitemap() {
  const urls = [];
  let latestPost = new Date(0);
  const allTags = new Set();
  const blogPosts = [];

  const files = await fs.readdir('posts');

  for (const file of files) {
    const slug = path.parse(file).name;
    const rawPost = await fs.readFile(path.join('posts', file), 'utf-8');
    const { tags, date } = extractFrontMatter(rawPost).data;

    const dateObj = new Date(date);
    if (isNaN(dateObj)) continue;

    blogPosts.push({
      url: `${SITE_URL}/blogi/julkaisu/${slug}`,
      date: dateObj,
    });

    if (dateObj > latestPost) latestPost = dateObj;

    tags
      .split(',')
      .map((t) => t.trim().toLowerCase().replaceAll(' ', '-'))
      .forEach((tag) => allTags.add(tag));
  }

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
      lastModified: toISODate(new Date(lastmod)),
    });
  }

  for (const tag of allTags) {
    urls.push({
      url: `${SITE_URL}/blogi/${tag}/sivu/1`,
      lastModified: toISODate(latestPost),
    });
  }

  for (const post of blogPosts) {
    urls.push({
      url: post.url,
      lastModified: toISODate(post.date),
    });
  }

  return urls;
}
