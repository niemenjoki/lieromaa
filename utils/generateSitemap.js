const fs = require('fs').promises;
const path = require('path');
const extractFrontMatter = require('./extractFrontMatter');
const { SITE_URL } = require('../data/vars');

function toISODate(d) {
  return d.toISOString().split('T')[0];
}

(async () => {
  console.log('Generating sitemap...');

  let latestPost = new Date(0);
  const allTags = new Set();
  const blogPosts = [];

  // Parallel read: posts list + worms.json
  const [files, wormsRaw] = await Promise.all([
    fs.readdir('posts'),
    fs.readFile(path.join('data', 'worms.json'), 'utf-8'),
  ]);

  // Process posts
  for (const file of files) {
    const slug = path.parse(file).name;
    const rawPost = await fs.readFile(path.join('posts', file), 'utf-8');
    const { tags, date } = extractFrontMatter(rawPost).data;

    const dateObj = new Date(date);
    if (isNaN(dateObj)) continue; // skip invalid dates

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

  // Worms JSON update date
  const worms = JSON.parse(wormsRaw);
  const wormsLastUpdate = new Date(
    Math.max(...worms.map((w) => new Date(w.updated).getTime()))
  );

  // Static pages
  const staticPages = [
    {
      url: '/tietoa',
      lastmod: '2025-09-08',
      priority: 0.5,
      changefreq: 'yearly',
    },
    {
      url: '/tietosuoja',
      lastmod: '2025-09-08',
      priority: 0.5,
      changefreq: 'yearly',
    },
    {
      url: '/tilausehdot',
      lastmod: '2025-10-07',
      priority: 0.3,
      changefreq: 'yearly',
    },
    {
      url: '/madot',
      lastmod: '2025-10-07',
      priority: 1.0,
      changefreq: 'weekly',
    },
    {
      url: '/matolaskuri',
      lastmod: '2025-10-07',
      priority: 0.5,
      changefreq: 'monthly',
    },
    {
     url: '/madot-kampanja',
     lastmod: '2025-10-14',
     priority: 0.3,
     changefreq: 'never'
    }
  ];

  // Start XML
  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Root page
  sitemapXML += `  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${toISODate(latestPost)}</lastmod>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>\n`;

  // Static pages
  for (const { url, lastmod, priority, changefreq } of staticPages) {
    sitemapXML += `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority.toFixed(1)}</priority>
    <changefreq>${changefreq}</changefreq>
  </url>\n`;
  }

  // Tag pages
  for (const tag of allTags) {
    sitemapXML += `  <url>
    <loc>${SITE_URL}/blogi/${tag}/sivu/1</loc>
    <lastmod>${toISODate(latestPost)}</lastmod>
    <priority>0.4</priority>
    <changefreq>monthly</changefreq>
  </url>\n`;
  }

  // Blog posts
  for (const post of blogPosts) {
    sitemapXML += `  <url>
    <loc>${post.url}</loc>
    <lastmod>${toISODate(post.date)}</lastmod>
    <priority>0.8</priority>
    <changefreq>yearly</changefreq>
  </url>\n`;
  }

  sitemapXML += '</urlset>';

  // Write file
  await fs.writeFile(path.join('public', 'sitemap.xml'), sitemapXML, {
    flag: 'w',
  });

  console.log(
    '\x1b[32m',
    `Sitemap sitemap.xml written successfully with ${
      (sitemapXML.match(/<loc>/g) || []).length
    } URLs`,
    '\x1b[0m'
  );
})();
