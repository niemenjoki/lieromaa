import { notFound } from 'next/navigation';

import BlogTagNavigation from '@/components/BlogTagNavigation/BlogTagNavigation';
import Pagination from '@/components/Pagination/Pagination';
import Post from '@/components/PostPreview/PostPreview';
import SiteSearch from '@/components/SiteSearch/SiteSearch';
import {
  getAllContentSlugs,
  getAllPostTags,
  getBlogPageData,
  getPaginatedPosts,
} from '@/lib/content/index.mjs';
import { getSiteSearchIndex } from '@/lib/search/siteSearchIndex.mjs';
import { CONTENT_TYPES, POSTS_PER_PAGE, SITE_URL } from '@/lib/site/constants.mjs';
import { createCollectionStructuredData } from '@/lib/structuredData/createCollectionStructuredData.mjs';

export { default as generateMetadata } from './generateMetadata';

export async function generateStaticParams() {
  const slugs = getAllContentSlugs({ type: CONTENT_TYPES.POST });

  const numPages = Math.ceil(slugs.length / POSTS_PER_PAGE);
  return Array.from({ length: numPages }, (_, i) => ({
    pageIndex: (i + 1).toString(),
  }));
}

export default async function BlogPage({ params }) {
  const { pageIndex } = await params;
  const pageData = getBlogPageData(pageIndex);
  const { posts, numPages } = getPaginatedPosts(pageData.pageIndexInt, POSTS_PER_PAGE);
  const searchItems = getSiteSearchIndex();
  if (posts.length === 0) {
    notFound();
  }
  const allTags = getAllPostTags();

  const ldJSON = createCollectionStructuredData({
    pageUrl: pageData.pageUrl,
    pageName: pageData.pageName,
    description: pageData.description,
    breadcrumbItems: pageData.breadcrumbItems,
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

      <h1>Lieromaan blogi – Asiaa kompostoinnista ja kestävästä kehityksestä</h1>

      <SiteSearch
        searchItems={searchItems}
        variant="blog"
        label="Hae sivustolta"
        placeholder="Hae oppaita, tuotteita tai blogijulkaisuja"
        resultLimit={5}
      />

      <BlogTagNavigation tags={allTags} />
      <h2 style={{ color: 'var(--highlight-alt)', marginTop: '1rem' }}>
        Viimeisimmät julkaisut
      </h2>
      {posts.map((post) => (
        <Post key={post.slug} post={post} />
      ))}

      <Pagination
        numPages={numPages}
        currentPage={pageData.pageIndexInt}
        basePath="/blogi"
        firstPagePath="/blogi"
      />
    </>
  );
}
