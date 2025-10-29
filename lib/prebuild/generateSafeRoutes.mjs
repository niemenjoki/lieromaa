import fs from 'fs';
import path from 'path';

import { POSTS_PER_PAGE } from '../../data/vars.mjs';

const appDir = path.join(process.cwd(), 'app');
const postsDir = path.join(process.cwd(), 'posts');
const outFile = path.join(process.cwd(), 'data', 'generated', 'safeRoutes.json');

function walk(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, list);
    } else if (entry.name === 'page.jsx') {
      let route = full.replace(appDir, '').replace(/[/\\]page\.jsx$/, '');
      if (route === '') route = '/';
      route = path.posix.normalize(route.replace(/\\/g, '/'));
      list.push(route);
    }
  }
  return list;
}

function getDynamicRoutes() {
  if (!fs.existsSync(postsDir)) {
    console.warn('⚠️  No /posts directory found — skipping dynamic routes.');
    return [];
  }

  const postSlugs = fs.readdirSync(postsDir);
  const postRoutes = postSlugs.map((slug) => `/blogi/julkaisu/${slug}`);

  const tagCounts = {};

  for (const slug of postSlugs) {
    const metaDataPath = path.join(postsDir, slug, 'data.json');
    if (!fs.existsSync(metaDataPath)) continue;

    try {
      const metadataRaw = fs.readFileSync(metaDataPath, 'utf-8');
      const { tags = [] } = JSON.parse(metadataRaw);
      for (const tag of tags.map((t) => t.trim()).filter(Boolean)) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    } catch (err) {
      console.warn(`⚠️  Failed to parse metadata for ${slug}: ${err.message}`);
    }
  }

  const tagRoutes = [];
  for (const [tag, count] of Object.entries(tagCounts)) {
    const safeTag = tag.replaceAll(' ', '-');
    const pageCount = Math.ceil(count / POSTS_PER_PAGE);
    for (let i = 1; i <= pageCount; i++) {
      tagRoutes.push(`/blogi/${safeTag}/sivu/${i}`);
    }
  }

  const blogListPageCount = Math.ceil(postSlugs.length / POSTS_PER_PAGE);
  const blogListPages = Array.from(
    { length: blogListPageCount },
    (_, i) => `/blogi/sivu/${i + 1}`
  );

  return [...postRoutes, ...tagRoutes, ...blogListPages];
}

function generate() {
  const staticRoutes = walk(appDir).filter((r) => !/\[[^\]]+\]/.test(r));
  const dynamicRoutes = getDynamicRoutes();

  const safeRoutes = Array.from(new Set([...staticRoutes, ...dynamicRoutes])).sort();

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(safeRoutes, null, 2));

  console.log(
    `✅ Safe internal routes written to ${outFile}\n` +
      `   Static:  ${staticRoutes.length}\n` +
      `   Dynamic: ${dynamicRoutes.length}\n` +
      `   Total:   ${safeRoutes.length}`
  );
}

generate();
