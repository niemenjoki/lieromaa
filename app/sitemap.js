import safeLinks from '@/generated/site/safeRoutes.json';
import {
  getAllContent,
  getAllGuideCategories,
  getAllPostTags,
  getPostsByTag,
} from '@/lib/content/index.mjs';
import { productCatalog } from '@/lib/products/catalog.mjs';
import { CONTENT_TYPES, POSTS_PER_PAGE, SITE_URL } from '@/lib/site/constants.mjs';
import {
  aboutPage,
  blogIndexPage,
  getLegalPageLastModified,
  orderTermsPage,
  privacyPolicyPage,
  starterKitSetupPage,
  wormCalculatorPage,
} from '@/lib/site/pageRecords.mjs';

const toISODate = (d) => new Date(d).toISOString().split('T')[0];
const slugify = (s) => s.replaceAll(' ', '-').trim().toLowerCase();

export const revalidate = 3600;

export default async function sitemap() {
  const urls = [];
  const posts = getAllContent({ type: CONTENT_TYPES.POST });
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });
  const postTags = getAllPostTags();
  const guideCategories = getAllGuideCategories();

  const latest = (arr, field) =>
    arr.reduce((latest, item) => {
      const d = new Date(item[field]);
      return d > latest ? d : latest;
    }, new Date(0));

  const latestPost = latest(posts, 'publishedAt');
  const latestGuide = latest(guides, 'updatedAt');

  const add = (url, lastmod) => {
    urls.push({ url: `${SITE_URL}${url}`, lastModified: toISODate(lastmod) });
  };

  [
    ['/', latestPost],
    ['/opas', latestGuide],
    [blogIndexPage.canonicalUrl, latestPost],
    [aboutPage.canonicalUrl, aboutPage.updatedAt],
    [privacyPolicyPage.canonicalUrl, getLegalPageLastModified(privacyPolicyPage)],
    [orderTermsPage.canonicalUrl, getLegalPageLastModified(orderTermsPage)],
    [productCatalog.worms.canonicalUrl, productCatalog.worms.updatedAt],
    [productCatalog.starterKit.canonicalUrl, productCatalog.starterKit.updatedAt],
    [starterKitSetupPage.canonicalUrl, starterKitSetupPage.updatedAt],
    [wormCalculatorPage.canonicalUrl, wormCalculatorPage.updatedAt],
  ].forEach(([url, lastmod]) => add(url, lastmod));

  // --- Tag pages
  for (const tag of postTags) {
    const slug = slugify(tag);
    const { numPages } = getPostsByTag(slug, 1, POSTS_PER_PAGE);
    for (let i = 1; i <= numPages; i++) add(`/blogi/${slug}/sivu/${i}`, latestPost);
  }

  // --- Guide categories
  guideCategories.forEach((cat) => add(`/opas/${slugify(cat)}`, latestGuide));

  // --- Blog posts
  posts.forEach((p) => add(`/blogi/julkaisu/${p.slug}`, p.updatedAt ?? p.publishedAt));

  // --- Guides
  guides.forEach((g) => add(`/opas/${slugify(g.category.name)}/${g.slug}`, g.updatedAt));

  // --- Paginated blog index
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  for (let i = 2; i <= totalPages; i++) add(`/blogi/sivu/${i}`, latestPost);

  // --- Validate paths
  urls.forEach(({ url }) => {
    const path = url.replace(SITE_URL, '');
    if (!safeLinks.includes(path)) {
      throw new Error(`Invalid url defined in sitemap: "${path}"`);
    }
  });

  return urls.sort((a, b) => a.url.localeCompare(b.url, 'fi'));
}
