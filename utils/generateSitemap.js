const fs = require('fs').promises;
const path = require('path');
const extractFrontMatter = require('./extractFrontMatter');
const { SITE_URL } = require('../data/vars');

(async () => {
  console.log('Generating sitemap...');

  let latestPost = new Date(0);
  const allTags = [];

  let blogPosts = [];

  const files = await fs.readdir('posts');

  for (const file of files) {
    const slug = path.parse(file).name;
    const rawPost = await fs.readFile(path.join('posts', file), 'utf-8');
    const { tags, date } = extractFrontMatter(rawPost).data;

    const dateObj = new Date(date);

    blogPosts.push({
      url: `${SITE_URL}/blogi/julkaisu/${slug}`,
      tags: tags.split(','),
      date: dateObj,
    });

    if (dateObj > latestPost) {
      latestPost = dateObj;
    }

    tags.split(',').forEach((tag) => allTags.push(tag));
  }

  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url>
<loc>${SITE_URL}</loc>
<xhtml:link rel="canonical" hreflang="fi" href="${SITE_URL}"/>
<xhtml:link rel="alternate" hreflang="fi" href="${SITE_URL}/blogi"/>
<xhtml:link rel="alternate" hreflang="fi" href="${SITE_URL}/blogi/sivu/1"/>
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
<url>

`;

  [...new Set(allTags)].forEach((tag) => {
    sitemapXML += '<url>\n';
    sitemapXML += `<loc>${SITE_URL}/blogi/${tag.toLowerCase()}/sivu/1</loc>\n`;
    sitemapXML += `<lastmod>${latestPost.toISOString()}</lastmod>\n`;
    sitemapXML += '</url>\n';
  });

  blogPosts.forEach((post) => {
    sitemapXML += '<url>\n';
    sitemapXML += `<loc>${post.url}</loc>\n`;
    sitemapXML += `<lastmod>${post.date.toISOString()}</lastmod>\n`;
    sitemapXML += '</url>\n';
  });

  sitemapXML += '</urlset>';

  try {
    await fs.writeFile(path.join('public', 'sitemap.xml'), sitemapXML, {
      flag: 'w',
    });
    const urlCount = (sitemapXML.match(/<loc>/g) || []).length;
    console.log(
      '\x1b[32m',
      `Sitemap sitemap.xml written successfully ${urlCount} listed`,
      '\x1b[0m'
    );
  } catch (e) {
    console.error('\x1b[31m', 'Failed to write sitemap.xml', '\x1b[0m');
    console.error(e);
  }
})();
