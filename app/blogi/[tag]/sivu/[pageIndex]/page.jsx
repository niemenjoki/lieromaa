import Link from 'next/link';

import Advert from '@/components/Advert/Advert';
import Pagination from '@/components/Pagination/Pagination';
import Post from '@/components/PostPreview/PostPreview';
import SearchPosts from '@/components/SearchPosts/SearchPosts';
import { POSTS_PER_PAGE, SITE_URL } from '@/data/vars';
import { getAllPosts, getAllTags, getPostsByTag } from '@/utils/mdx';

import classes from './TagPage.module.css';

export async function generateStaticParams() {
  const allPosts = getAllPosts();
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

export async function generateMetadata({ params }) {
  const { tag, pageIndex } = await params;
  const tagName = tag.replaceAll('-', ' ');
  return {
    title: `Blogi: ${tagName} | Luomuliero`,
    description: `Luomulieron blogijulkaisut avainsanalla "${tagName}".`,
    alternates: {
      canonical: `${SITE_URL}/blogi/${tag}/sivu/1`,
    },
    openGraph: {
      title: `Blogi: ${tagName} | Luomuliero`,
      description: `Luomulieron blogijulkaisut avainsanalla "${tagName}".`,
      url: `${SITE_URL}/blogi/${tag}/sivu/${pageIndex}`,
    },
  };
}

export default async function BlogTagPage({ params }) {
  const { pageIndex, tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const pageIndexInt = parseInt(pageIndex) || 1;
  const { posts, numPages } = getPostsByTag(decodedTag, pageIndexInt, POSTS_PER_PAGE);

  const allTags = getAllTags();

  const tagDisplay = decodedTag.replaceAll('-', ' ');

  return (
    <>
      <h1>Julkaisut avainsanalla "{tagDisplay}"</h1>

      <SearchPosts
        list={posts}
        keys={['title', 'excerpt', 'keywords', 'tags']}
        placeholder="Etsi julkaisun nimellä tai avainsanalla.."
      />

      <div className={classes.Taglist}>
        <Link href="/blogi" className={classes.Tag}>
          Kaikki
        </Link>
        {allTags.map((t) => {
          const isActive =
            t.toLowerCase().replaceAll(' ', '-') ===
            decodedTag.toLowerCase().replaceAll(' ', '-');
          return (
            <Link
              key={t}
              href={`/blogi/${t.toLowerCase().replaceAll(' ', '-')}/sivu/1`}
              className={`${classes.Tag} ${isActive ? classes.ActiveTag : ''}`}
            >
              {t}
            </Link>
          );
        })}
      </div>

      {posts.map((post, i) => (
        <Post key={i} post={post} />
      ))}

      <Pagination numPages={numPages} currentPage={pageIndexInt} />
      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
    </>
  );
}
