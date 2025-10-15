// utils/dumpKeywords.js
const fs = require('fs').promises;
const path = require('path');
const extractFrontMatter = require('./extractFrontMatter.js');

(async () => {
  try {
    const postsDir = path.join(process.cwd(), 'posts');
    const files = await fs.readdir(postsDir);

    for (const file of files) {
      if (!file.endsWith('.md') || file.startsWith('draft')) continue;

      const raw = await fs.readFile(path.join(postsDir, file), 'utf-8');
      const { data } = extractFrontMatter(raw);

      console.log(
        JSON.stringify(
          {
            slug: file.replace('.md', ''),
            keywords: data.keywords || '',
          },
          null,
          2
        )
      );
    }
  } catch (err) {
    console.error(err);
  }
})();
