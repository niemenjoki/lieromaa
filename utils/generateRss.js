const fs = require('fs');
const path = require('path');
const extractFrontMatter = require('./extractFrontMatter');
const { SITE_URL } = require('../data/vars');

const getAllPosts = () => {
  const filenames = fs.readdirSync('posts');
  const posts = filenames.map((filename) => {
    const filepath = path.join('posts', filename);
    const markdownWithMeta = fs.readFileSync(filepath, 'utf-8');
    const postData = extractFrontMatter(markdownWithMeta);

    const pathname = '/blogi/julkaisu/';
    const link = `${SITE_URL}${pathname}${filename.replace('.md', '')}`;

    return {
      title: postData.data.title,
      date: postData.data.date,
      excerpt: postData.data.excerpt,
      link,
    };
  });
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const getXmlItems = (blogPosts) => {
  return blogPosts
    .map((post) => {
      return `<item>
            <title>${post.title}</title>
            <link>${post.link}</link>
            <guid>${post.link}</guid>
            <pubDate>${new Date(post.date).toUTCString()}</pubDate>
            <description>${post.excerpt}</description>
            <dc:creator>Joonas Niemenjoki</dc:creator>
        </item>
        `;
    })
    .join('');
};

const getRssXml = (xmlItems, latestPostDate, filename) => {
  const data = {
    title: 'Luomuliero',
    link: SITE_URL,
    description:
      'Tietoa ja vinkkejä matokompostoinnista, kierrätyksestä. Luomuliero auttaa tekemään jätteestä ravinnerikasta multaa!',
  };

  return `<?xml version="1.0" ?>
  <rss
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    version="2.0"
  >
    <channel>
      <title><![CDATA[ ${data.title} ]]></title>
      <link>${data.link}</link>
      <atom:link href="${SITE_URL}/${filename}" rel="self" type="application/rss+xml" />
      <description><![CDATA[ ${data.description} ]]></description>
      <language>fi</language>
      <lastBuildDate>${new Date(latestPostDate).toUTCString()}</lastBuildDate>
      ${xmlItems}
  </channel>
  </rss>`;
};

const generateRSSFeed = (filename) => {
  const postData = getAllPosts();
  const xmlItems = getXmlItems(postData);
  const rssXml = getRssXml(xmlItems, postData[0].date, filename);

  fs.writeFile(path.join('public', filename), rssXml, (err) => {
    if (err) {
      console.log(
        '\x1b[31m',
        `Failed to write RSS feed ${filename}`,
        '\x1b[0m'
      );
      console.log(err);
    } else {
      console.log(
        '\x1b[32m',
        `RSS feed ${filename} written successfully`,
        '\x1b[0m'
      );
    }
  });
};

generateRSSFeed('rss.xml');
