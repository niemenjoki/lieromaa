// lib/prebuild/verifyMetadata.mjs
import { CONTENT_TYPES } from '../../data/site/constants.mjs';
import { getAllContent } from '../content/getAllContent.mjs';
import { productCatalog } from '../products/catalog.mjs';
import { homePage, standaloneSitePages, starterKitSetupPage } from '../site/pageRecords.mjs';

const { posts, guides } = getAllContent({ type: CONTENT_TYPES.ALL });
const staticPages = [
  homePage,
  ...Object.values(standaloneSitePages),
  starterKitSetupPage,
  ...Object.values(productCatalog),
];

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

function validateFaqItems(faqItems, slug) {
  if (!faqItems) {
    return;
  }

  faqItems.forEach((item, index) => {
    if (!item.question) fail(`[${slug}] faqItems[${index}] is missing question`);
    if (!item.answer) fail(`[${slug}] faqItems[${index}] is missing answer`);
  });
}

console.log(
  `🔍 Checking ${posts.length} posts, ${guides.length} guides and ${staticPages.length} static pages for metadata mistakes...`
);

function getRecordIdentifier(record) {
  return (
    record.slug ??
    record.canonicalUrl ??
    record.pageUrl ??
    record.pageName ??
    record.title ??
    'unknown'
  );
}

// --- POSTS CHECK ---
for (const post of posts) {
  const {
    title,
    description,
    slug,
    structuredData,
    publishedAt,
    updatedAt,
    tags,
    keywords,
    faqItems,
  } = post;

  // Required fields
  if (!title) fail(`[${slug}] Missing title`);
  if (!description) fail(`[${slug}] Missing description`);
  if (!structuredData) fail(`[${slug}] Missing structuredData`);

  // Date validity
  if (!publishedAt || !isValidDate(publishedAt))
    fail(`[${slug}] Invalid or missing publishedAt: ${publishedAt}`);
  if (updatedAt && !isValidDate(updatedAt))
    fail(`[${slug}] Invalid updatedAt: ${updatedAt}`);

  // Tags and keywords
  if (!tags || tags.length < 1) fail(`[${slug}] Must have at least 1 tag`);
  if (!keywords || keywords.length < 2) fail(`[${slug}] Must have at least 2 keywords`);
  validateFaqItems(faqItems, slug);

  // Lengths
  validateLength(title, 50, 60, 'title', slug);
  validateLength(description, 110, 160, 'description', slug);
}

// --- GUIDES CHECK ---
const categoryMap = new Map();

for (const guide of guides) {
  const {
    title,
    description,
    slug,
    structuredData,
    publishedAt,
    updatedAt,
    category,
    keywords,
    schemaType,
    faqItems,
  } = guide;

  // Required fields
  if (!title) fail(`[${slug}] Missing title`);
  if (!description) fail(`[${slug}] Missing description`);
  if (!slug) fail(`[${title}] Missing slug`);
  if (!structuredData) fail(`[${slug}] Missing structuredData`);

  // Date validity
  if (!publishedAt || !isValidDate(publishedAt))
    fail(`[${slug}] Invalid or missing publishedAt: ${publishedAt}`);
  if (!updatedAt || !isValidDate(updatedAt))
    fail(`[${slug}] Invalid or missing updatedAt: ${updatedAt}`);

  // Category check
  if (!category || !category.name) fail(`[${slug}] Missing category.name`);
  if (category.pagePosition == null) fail(`[${slug}] Missing category.pagePosition`);
  if (!keywords || keywords.length < 2) fail(`[${slug}] Must have at least 2 keywords`);
  if (schemaType === 'FAQPage' && (!faqItems || faqItems.length === 0)) {
    fail(`[${slug}] FAQPage content must include faqItems`);
  }
  validateFaqItems(faqItems, slug);

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

// --- STATIC PAGES CHECK ---
for (const page of staticPages) {
  const { title, description, canonicalUrl } = page;
  const recordId = getRecordIdentifier(page);

  if (!title) fail(`[${recordId}] Missing title`);
  if (!description) fail(`[${recordId}] Missing description`);
  if (!canonicalUrl) fail(`[${recordId}] Missing canonicalUrl`);

  validateLength(description, 110, 160, 'description', recordId);
}

// --- RESULT ---
if (hasError) {
  console.error('\n❌ Metadata verification failed.\n');
  process.exit(1);
} else {
  console.log('✅ All metadata checks passed.\n');
}
