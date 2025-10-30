// lib/prebuild/verifyMetadata.mjs
import { CONTENT_TYPES } from '../../data/vars.mjs';
import { getAllContent } from '../content/getAllContent.mjs';

const { posts, guides } = getAllContent({ type: CONTENT_TYPES.ALL });

let hasError = false;

function fail(message) {
  console.error(`❌ ${message}`);
  hasError = true;
}

function validateLength(str, min, max, field, slug) {
  if (!str || str.length < min || str.length > max) {
    fail(
      `[${slug}] ${field} length invalid (${str?.length || 0} chars, expected ${min}-${max})`
    );
  }
}

function isValidDate(dateString) {
  const d = new Date(dateString);
  return !isNaN(d.getTime());
}

console.log(`🔍 Checking ${posts.length} posts and ${guides.length} guides...\n`);

// --- POSTS CHECK ---
for (const post of posts) {
  const { title, description, slug, structuredData, date, tags, keywords } = post;

  // Required fields
  if (!title) fail(`[${slug}] Missing title`);
  if (!description) fail(`[${slug}] Missing description`);
  if (!structuredData) fail(`[${slug}] Missing structuredData`);

  // Date validity
  if (!date || !isValidDate(date)) fail(`[${slug}] Invalid or missing date: ${date}`);

  // Tags and keywords
  if (!tags || tags.length < 1) fail(`[${slug}] Must have at least 1 tag`);
  if (!keywords || keywords.length < 2) fail(`[${slug}] Must have at least 2 keywords`);

  // Lengths
  validateLength(title, 50, 60, 'title', slug);
  validateLength(description, 110, 160, 'description', slug);
}

// --- GUIDES CHECK ---
const categoryMap = new Map();

for (const guide of guides) {
  const { title, description, slug, structuredData, updated, category } = guide;

  // Required fields
  if (!title) fail(`[${slug}] Missing title`);
  if (!description) fail(`[${slug}] Missing description`);
  if (!slug) fail(`[${title}] Missing slug`);
  if (!structuredData) fail(`[${slug}] Missing structuredData`);

  // Updated date validity
  if (!updated || !isValidDate(updated))
    fail(`[${slug}] Invalid or missing updated date: ${updated}`);

  // Category check
  if (!category || !category.name) fail(`[${slug}] Missing category.name`);
  if (category.pagePosition == null) fail(`[${slug}] Missing category.pagePosition`);

  // Page position conflicts
  const key = category.name.toLowerCase();
  const existing = categoryMap.get(key) || new Set();
  if (existing.has(category.pagePosition)) {
    fail(
      `[${slug}] Duplicate pagePosition ${category.pagePosition} in category "${category.name}"`
    );
  }
  existing.add(category.pagePosition);
  categoryMap.set(key, existing);

  // Lengths
  validateLength(title, 50, 65, 'title', slug);
  validateLength(description, 110, 160, 'description', slug);
}

// --- RESULT ---
if (hasError) {
  console.error('\n❌ Metadata verification failed.\n');
  process.exit(1);
} else {
  console.log('✅ All metadata checks passed.\n');
}
