// /tests/testPostMetadata.js
const fs = require('fs').promises;
const path = require('path');
const extractFrontMatter = require('../utils/extractFrontMatter');

// Color helpers
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const POSTS_DIR = path.join(__dirname, '..', 'posts');

// Google-linjassa järkevät rajat
const TITLE_MIN = 20;
const TITLE_MAX = 60;
const EXCERPT_MIN = 110;
const EXCERPT_MAX = 160;

// Poista aidatut koodilohkot ennen otsikkoparsintaa (``` ... ``` tai ~~~ ... ~~~)
function stripFencedCodeBlocks(text) {
  return text.replace(/```[\s\S]*?```/g, '').replace(/~~~[\s\S]*?~~~/g, '');
}

async function testPostMetadata() {
  const files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith('.md'));
  const issues = [];

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const raw = await fs.readFile(filePath, 'utf8');
    const { data, content } = extractFrontMatter(raw);

    const text = stripFencedCodeBlocks(content);

    const hasH1 = /^#\s+.+/m.test(text);
    if (hasH1) {
      issues.push(
        `${colors.red}[${file}] duplicate H1 headings${colors.reset}\n`,
      );
    }

    const title = data.title || '';
    if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
      issues.push(
        `${colors.yellow}[${file}] title length ${title.length} is outside recommended ${TITLE_MIN}-${TITLE_MAX}${colors.reset}\n`,
      );
    }

    const excerpt = data.excerpt || '';
    if (excerpt.length < EXCERPT_MIN || excerpt.length > EXCERPT_MAX) {
      issues.push(
        `${colors.yellow}[${file}] excerpt length ${excerpt.length} is outside recommended ${EXCERPT_MIN}-${EXCERPT_MAX}${colors.reset}\n`,
      );
    }

    const headingMatches = [...text.matchAll(/^(#{2,6})\s+\S+/gm)];
    const headingLevels = headingMatches.map((m) => m[1].length);

    if (headingLevels.length > 0) {
      const first = headingLevels[0];
      if (first !== 2) {
        issues.push(
          `${colors.red}[${file}] first heading not h2, found h${first}${colors.reset}\n`,
        );
      }

      for (let i = 1; i < headingLevels.length; i++) {
        const prev = headingLevels[i - 1];
        const curr = headingLevels[i];
        if (curr > prev + 1) {
          issues.push(
            `${colors.red}[${file}] heading level skipped from h${prev} → h${curr}${colors.reset}\n`,
          );
        }
      }
    }
  }

  if (issues.length) {
    console.log(
      `${colors.yellow}${colors.bold}⚠️  Metadata issues found:${colors.reset}\n`,
    );
    for (const issue of issues) console.log(' - ' + issue);
    console.log(
      `\n${colors.red}❌ Found ${issues.length} post metadata issues${colors.reset}`,
    );
  } else {
    console.log(
      `${colors.green}✅ All post metadata checks passed.${colors.reset}`,
    );
  }
}

module.exports = { testPostMetadata };
