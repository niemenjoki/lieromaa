import fs from 'fs/promises';
import path from 'path';

import { SITE_URL } from '../../data/vars';
import extractFrontMatter from '../../utils/extractFrontMatter';

export async function GET() {
  const filenames = await fs.readdir('posts');
  const posts = [];

  for (const filename of filenames) {
    const filepath = path.join('posts', filename);
    const markdownWithMeta = await fs.readFile(filepath, 'utf-8');
    const postData = extractFrontMatter(markdownWithMeta);
    const slug = filename.replace('.md', '');

    posts.push({
      title: postData.data.title,
      date: new Date(postData.data.date),
      excerpt: postData.data.excerpt,
      link: `${SITE_URL}/blogi/julkaisu/${slug}`,
    });
  }

  posts.sort((a, b) => b.date - a.date);
  const latestPostDate = posts[0]?.date || new Date();

  const xmlItems = posts
    .map(
      (post) => `<item>
        <title><![CDATA[ ${post.title} ]]></title>
        <link>${post.link}</link>
        <guid>${post.link}</guid>
        <pubDate>${post.date.toUTCString()}</pubDate>
        <description><![CDATA[ ${post.excerpt} ]]></description>
        <dc:creator>Joonas Niemenjoki</dc:creator>
      </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    version="2.0"
  >
    <channel>
      <title><![CDATA[ Luomuliero ]]></title>
      <link>${SITE_URL}</link>
      <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
      <description><![CDATA[ Tietoa ja vinkkejä matokompostoinnista, kierrätyksestä. Luomuliero auttaa tekemään jätteestä ravinnerikasta multaa! ]]></description>
      <language>fi</language>
      <lastBuildDate>${latestPostDate.toUTCString()}</lastBuildDate>
      ${xmlItems}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
