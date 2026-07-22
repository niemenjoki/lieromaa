import { notFound } from 'next/navigation';

import BlogTagNavigation from '@/components/BlogTagNavigation/BlogTagNavigation';
import Pagination from '@/components/Pagination/Pagination';
import Post from '@/components/PostPreview/PostPreview';
import SiteSearch from '@/components/SiteSearch/SiteSearch';
import {
  getAllContent,
  getAllPostTags,
  getBlogTagPageData,
  getPostsByTag,
} from '@/lib/content/index.mjs';
import { getSiteSearchIndex } from '@/lib/search/siteSearchIndex.mjs';
import { CONTENT_TYPES, POSTS_PER_PAGE, SITE_URL } from '@/lib/site/constants.mjs';
import { createCollectionStructuredData } from '@/lib/structuredData/createCollectionStructuredData.mjs';

export { default as generateMetadata } from './generateMetadata';

export async function generateStaticParams() {
  const allPosts = getAllContent({ type: CONTENT_TYPES.POST });
  const groupedPosts = {};

  allPosts.forEach((post) => {
    const tags = post.tags.map((t) => t.trim().toLowerCase().replaceAll(' ', '-'));
    tags.forEach((tag) => {
      if (!groupedPosts[tag]) groupedPosts[tag] = [];
      groupedPosts[tag].push(post.slug);
    });
  });

  const params = [];
  for (const tag of Object.keys(groupedPosts)) {
    const numPages = Math.ceil(groupedPosts[tag].length / POSTS_PER_PAGE);
    for (let i = 1; i <= numPages; i++) {
      params.push({ tag, pageIndex: i.toString() });
    }
  }

  return params;
}

export default async function BlogTagPage({ params }) {
  const { pageIndex, tag } = await params;
  const pageData = getBlogTagPageData({ tag, pageIndex });
  const { posts, numPages } = getPostsByTag(
    pageData.tagSlug,
    pageData.pageIndexInt,
    POSTS_PER_PAGE
  );
  const searchItems = getSiteSearchIndex();
  if (posts.length === 0) {
    notFound();
  }
  const allTags = getAllPostTags();

  const ldJSON = createCollectionStructuredData({
    pageUrl: pageData.pageUrl,
    pageName: pageData.pageName,
    description: pageData.description,
    itemListElement: posts.map((post, i) => ({
      '@type': 'ListItem',
      position: (pageData.pageIndexInt - 1) * POSTS_PER_PAGE + (i + 1),
      url: `${SITE_URL}/blogi/julkaisu/${post.slug}`,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ldJSON).replace(/</g, '\\u003c'),
        }}
      />
      <h1>Julkaisut avainsanalla "{pageData.tagName}"</h1>

      <SiteSearch
        searchItems={searchItems}
        variant="blog"
        label="Hae sivustolta"
        placeholder="Hae oppaita, tuotteita tai blogijulkaisuja"
        resultLimit={5}
      />

      <BlogTagNavigation activeTagSlug={pageData.tagSlug} tags={allTags} />

      {posts.map((post) => (
        <Post key={post.slug} post={post} />
      ))}

      <Pagination
        numPages={numPages}
        currentPage={pageData.pageIndexInt}
        basePath={`/blogi/${tag}`}
      />
    </>
  );
}
