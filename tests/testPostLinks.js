// /tests/testPostLinks.js
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

async function testPostLinks() {
  const files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith('.md'));
  const slugs = files.map((f) => path.basename(f, '.md'));
  const issues = [];

  // Allowed paths (besides /blogi/julkaisu/[slug])
  const allowedStaticPaths = [
    '/',
    '/madot',
    '/matolaskuri',
    '/tietoa',
    '/tietosuoja',
    '/tilausehdot',
  ];

  const linkRegex = /https?:\/\/(?:www\.)?luomuliero\.fi[^\s"'<>)]*/g;

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const raw = await fs.readFile(filePath, 'utf8');
    const { content } = extractFrontMatter(raw);

    // Find all Luomuliero links (with or without www)
    const matches = [
      ...content.matchAll(/https?:\/\/([a-z.]*?)luomuliero\.fi([^\s"'<>)]*)/g),
    ];

    for (const match of matches) {
      const subdomain = match[1];
      const pathPart = match[2] || '';

      // 1. Enforce www
      if (subdomain !== 'www.') {
        issues.push(
          `${colors.red}[${file}] non-www URL used: ${match[0]}${colors.reset}\n`,
        );
      }

      // 2. Ensure https
      if (!match[0].startsWith('https://')) {
        issues.push(
          `${colors.red}[${file}] non-https URL used: ${match[0]}${colors.reset}\n`,
        );
      }

      // 3. Check path validity
      const urlPath = pathPart.split(/[?#]/)[0]; // ignore query/hash
      if (!urlPath) continue;

      // Check for /blogi/julkaisu/[slug]
      const blogMatch = urlPath.match(/^\/blogi\/julkaisu\/([^/]+)$/);
      if (blogMatch) {
        const slug = blogMatch[1];
        if (!slugs.includes(slug)) {
          issues.push(
            `${colors.red}[${file}] link to non-existent post slug: ${slug}${colors.reset}\n`,
          );
        }
        continue;
      }

      // Check static path validity
      if (!allowedStaticPaths.includes(urlPath)) {
        issues.push(
          `${colors.red}[${file}] invalid internal URL path: ${urlPath}${colors.reset}\n`,
        );
      }
    }

    // 4. Detect relative Luomuliero links (like href="/madot" or href="madot")
    const relativeMatches = [
      ...content.matchAll(/href\s*=\s*["'](\/?[^"']+)["']/g),
    ];
    for (const match of relativeMatches) {
      const href = match[1];
      if (href.startsWith('http')) continue; // already absolute
      if (href.includes('luomuliero')) continue; // handled above

      if (allowedStaticPaths.includes(href)) {
        issues.push(
          `${colors.yellow}[${file}] relative internal link used instead of full URL: ${href}${colors.reset}\n`,
        );
      }
    }
  }

  if (issues.length) {
    console.log(
      `${colors.yellow}${colors.bold}⚠️  Link issues found:${colors.reset}\n`,
    );
    for (const issue of issues) console.log(' - ' + issue);
    console.log(
      `\n${colors.red}❌ Found ${issues.length} post link issues${colors.reset}`,
    );
  } else {
    console.log(
      `${colors.green}✅  All Luomuliero link checks passed.${colors.reset}`,
    );
  }
}

module.exports = { testPostLinks };
