const fs = require('fs').promises;
const path = require('path');
const extractFrontMatter = require('./extractFrontMatter.js');

(async () => {
  try {
    const postsDir = path.join(process.cwd(), 'posts');
    const files = await fs.readdir(postsDir);

    const keywordsSet = new Set();

    for (const file of files) {
      if (!file.endsWith('.md') || file.startsWith('draft')) continue;

      const raw = await fs.readFile(path.join(postsDir, file), 'utf-8');
      const { data } = extractFrontMatter(raw);

      if (data.keywords) {
        data.keywords
          .split(',')
          .map((kw) => kw.trim().toLowerCase()) // normalize spaces
          .filter((kw) => kw.length > 0)
          .forEach((kw) => keywordsSet.add(kw));
      }
    }

    const keywords = Array.from(keywordsSet)
      .map((kw) => kw.trim()) // extra safety
      .filter((kw) => kw.length > 0)
      .sort((a, b) => a.localeCompare(b, 'fi'));

    console.log('All unique keywords:\n');
    console.log(keywords.join('\n'));
  } catch (err) {
    console.error('Error extracting keywords:', err);
  }
})();
