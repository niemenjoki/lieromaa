const fs = require('fs').promises;
const extractFrontMatter = require('./extractFrontMatter.js');

(async () => {
  const posts = await fs.readdir('posts');
  const keywords = await Promise.all(
    posts.map(async (postSlug) => {
      const rawPost = await fs.readFile('posts' + '/' + postSlug, 'utf-8');
      const { data } = extractFrontMatter(rawPost);
      return data.keywords.split(',').map((kw) => kw.trim().toLowerCase());
    })
  );

  const uniqueKeywords = [...new Set(keywords.flat())].sort();
})();
