const fs = require('fs').promises;
const path = require('path');
const extractFrontMatter = require('./extractFrontMatter');
const { SITE_URL } = require('../data/vars');

(async () => {
  console.log('Generating sitemap...');

  let latestPost = new Date(0);
  const allTags = new Set();
  const blogPosts = [];

  const files = await fs.readdir('posts');

  for (const file of files) {
    const slug = path.parse(file).name;
    const rawPost = await fs.readFile(path.join('posts', file), 'utf-8');
    const { tags, date } = extractFrontMatter(rawPost).data;

    const dateObj = new Date(date);
    blogPosts.push({
      url: `${SITE_URL}/blogi/julkaisu/${slug}`,
      date: dateObj,
    });

    if (dateObj > latestPost) latestPost = dateObj;
    tags
      .split(',')
      .map((t) => t.trim())
      .forEach((tag) => allTags.add(tag));
  }

  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${latestPost.toISOString()}</lastmod>
  </url>
  <url>
    <loc>${SITE_URL}/tietoa</loc>
    <lastmod>2024-02-29T00:00:00.000Z</lastmod>
  </url>
  <url>
    <loc>${SITE_URL}/tietosuoja</loc>
    <lastmod>2024-02-22T00:00:00.000Z</lastmod>
  </url>
`;

  // Add tag pages (if you want them indexed)
  for (const tag of allTags) {
    sitemapXML += `  <url>
    <loc>${SITE_URL}/blogi/${tag.toLowerCase()}/</loc>
    <lastmod>${latestPost.toISOString()}</lastmod>
  </url>\n`;
  }

  // Add post pages
  for (const post of blogPosts) {
    sitemapXML += `  <url>
    <loc>${post.url}</loc>
    <lastmod>${post.date.toISOString()}</lastmod>
  </url>\n`;
  }

  sitemapXML += '</urlset>';

  await fs.writeFile(path.join('public', 'sitemap.xml'), sitemapXML, {
    flag: 'w',
  });
  console.log(
    `Sitemap sitemap.xml written successfully with ${
      (sitemapXML.match(/<loc>/g) || []).length
    } URLs`
  );
})();
