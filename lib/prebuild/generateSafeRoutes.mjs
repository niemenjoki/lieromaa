import fs from 'fs';
import path from 'path';

import { CONTENT_TYPES, POSTS_PER_PAGE } from '../../data/vars.mjs';
import {
  getAllContent,
  getAllGuideCategories,
  getAllPostTags,
  getPostsByTag,
} from '../content/index.mjs';

const appDir = path.join(process.cwd(), 'app');
const postsDir = path.join(process.cwd(), 'posts');
const guidesDir = path.join(process.cwd(), 'guides');
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
      route = path.posix.normalize(route.replace(/\\/g, '/')).replace(/\/\([^/]+\)/g, '');
      if (route === '') route = '/';
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

  if (!fs.existsSync(guidesDir)) {
    console.warn('⚠️  No /guides directory found — skipping dynamic routes.');
    return [];
  }

  const posts = getAllContent({ type: CONTENT_TYPES.POST });
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });

  const postRoutes = posts.map((post) => `/blogi/julkaisu/${post.slug}`);
  const guideRoutes = guides.map((guide) => {
    const categorySlug = guide.category.name.replaceAll(' ', '-');
    return `/opas/${categorySlug}/${guide.slug}`;
  });

  const postTagRoutes = [];
  const postTags = getAllPostTags();

  for (const tag of postTags) {
    const tagSlug = tag.replaceAll(' ', '-');
    const { numPages } = getPostsByTag(tagSlug, 1, POSTS_PER_PAGE);

    for (let i = 1; i <= numPages; i++) {
      postTagRoutes.push(`/blogi/${tagSlug}/sivu/${i}`);
    }
  }

  const guideCategoryRoutes = getAllGuideCategories().map((category) => {
    const categorySlug = category.replaceAll(' ', '-');
    return `/opas/${categorySlug}`;
  });

  const blogListPageCount = Math.ceil(posts.length / POSTS_PER_PAGE);
  const blogListRoutes = Array.from(
    { length: blogListPageCount },
    (_, i) => `/blogi/sivu/${i + 1}`
  );

  return [
    ...postRoutes,
    ...guideRoutes,
    ...postTagRoutes,
    ...guideCategoryRoutes,
    ...blogListRoutes,
  ];
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
