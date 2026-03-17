import { notFound } from 'next/navigation';

import Advert from '@/components/Advert/Advert';
import Pagination from '@/components/Pagination/Pagination';
import Post from '@/components/PostPreview/PostPreview';
import SafeLink from '@/components/SafeLink/SafeLink';
import SearchPosts from '@/components/SearchPosts/SearchPosts';
import { CONTENT_TYPES, POSTS_PER_PAGE, SITE_URL } from '@/data/site/constants.mjs';
import {
  getAllContent,
  getAllPostTags,
  getBlogTagPageData,
  getPostsByTag,
} from '@/lib/content/index.mjs';
import { getSearchableSitePages } from '@/lib/siteStructure.mjs';
import { createCollectionStructuredData } from '@/lib/structuredData/createCollectionStructuredData.mjs';

import classes from './TagPage.module.css';

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
  const { posts, numPages, allPostsForTag } = getPostsByTag(
    pageData.tagSlug,
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

      <SearchPosts
        list={allPostsForTag}
        keys={['title', 'description', 'keywords', 'tags']}
        placeholder="Etsi julkaisun nimellä tai avainsanalla.."
        extraItems={searchablePages}
      />

      <div className={classes.Taglist}>
        <SafeLink href="/blogi" className={classes.Tag}>
          Kaikki
        </SafeLink>
        {allTags.map((t) => {
          const isActive =
            t.toLowerCase().replaceAll(' ', '-') === pageData.tagSlug.toLowerCase();
          return (
            <SafeLink
              key={t}
              href={`/blogi/${t.toLowerCase().replaceAll(' ', '-')}/sivu/1`}
              className={`${classes.Tag} ${isActive ? classes.ActiveTag : ''}`}
            >
              {t}
            </SafeLink>
          );
        })}
      </div>

      {posts.map((post, i) => (
        <Post key={i} post={post} />
      ))}

      <Pagination
        numPages={numPages}
        currentPage={pageData.pageIndexInt}
        basePath={`/blogi/${tag}`}
      />
      <Advert />
    </>
  );
}
