import { notFound } from 'next/navigation';

import Advert from '@/components/Advert/Advert';
import Pagination from '@/components/Pagination/Pagination';
import Post from '@/components/PostPreview/PostPreview';
import SafeLink from '@/components/SafeLink/SafeLink';
import SearchPosts from '@/components/SearchPosts/SearchPosts';
import {
  getAllContentSlugs,
  getAllPostTags,
  getBlogPageData,
  getPaginatedPosts,
} from '@/lib/content/index.mjs';
import { CONTENT_TYPES, POSTS_PER_PAGE, SITE_URL } from '@/lib/site/constants.mjs';
import { getSearchableSitePages } from '@/lib/siteStructure.mjs';
import { createCollectionStructuredData } from '@/lib/structuredData/createCollectionStructuredData.mjs';

import classes from './PostPage.module.css';

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
  const { posts, numPages, allPosts } = getPaginatedPosts(
    pageData.pageIndexInt,
    POSTS_PER_PAGE
  );
  const searchablePages = getSearchableSitePages({ context: 'blog' });
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

      <SearchPosts
        list={allPosts}
        keys={['title', 'description', 'keywords', 'tags']}
        placeholder="Etsi julkaisun nimellä tai avainsanalla.."
        extraItems={searchablePages}
      />

      <div className={classes.Taglist}>
        <SafeLink href="/blogi" className={`${classes.Tag} ${classes.ActiveTag}`}>
          Kaikki
        </SafeLink>
        {allTags.map((tag) => (
          <SafeLink
            href={`/blogi/${tag.toLowerCase().replaceAll(' ', '-')}/sivu/1`}
            key={tag}
            className={classes.Tag}
          >
            {tag}
          </SafeLink>
        ))}
      </div>
      <h2 style={{ color: 'var(--highlight-alt)', marginTop: '1rem' }}>
        Viimeisimmät julkaisut
      </h2>
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}

      <Pagination
        numPages={numPages}
        currentPage={pageData.pageIndexInt}
        basePath="/blogi"
      />
      <Advert />
    </>
  );
}
