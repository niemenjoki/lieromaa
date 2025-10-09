import Advert from '@/components/Advert';
import Layout from '@/components/Layout';
import PostRecommendation from '@/components/PostRecommendation';
import SocialShareButtons from '@/components/SocialShareButtons';
import classes from '@/styles/PostPage.module.css';
import extractFrontMatter from '@/utils/extractFrontMatter';
import getPostRecommendations from '@/utils/getPostRecommendations';
import fs from 'fs';
import hljs from 'highlight.js';
import { marked } from 'marked';
import path from 'path';
import { SITE_URL } from '@/data/vars';

const PostPage = ({ data, content, recommendedPosts = [], structuredData }) => {
  const { title, date, tags, excerpt } = data;
  return (
    <Layout
      title={title}
      ads={true}
      description={excerpt}
      structuredData={structuredData}
    >
      <article className={classes.PostPage}>
        <h1>{title}</h1>
        <div className={classes.Date}>
          Julkaistu: {new Date(date).toLocaleDateString('fi-FI')}
        </div>
        <div
          className={classes.Content}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </article>
      <SocialShareButtons title={title} text={excerpt} tags={tags} />
      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
      <PostRecommendation posts={recommendedPosts} />
    </Layout>
  );
};

export default PostPage;
const getStaticPaths = async () => {
  const files = fs.readdirSync('posts');
  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }));
  return { paths, fallback: false };
};

const getStaticProps = async ({ params: { slug } }) => {
  const markdownWithMeta = fs.readFileSync(
    path.join('posts', slug + '.md'),
    'utf-8'
  );

  const { data, content } = extractFrontMatter(markdownWithMeta);

  const recommendedPosts = await getPostRecommendations({
    self: slug,
    keywords: data.keywords + ',' + data.tags,
  });

  marked.setOptions({
    highlight: function (code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-',
  });
  const htmlContent = marked(content);

  const structuredData = data.structuredData || [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: data.title,
      description: data.excerpt,
      datePublished: data.date,
      author: { '@type': 'Person', name: 'Joonas Niemenjoki' },
      publisher: {
        '@type': 'Organization',
        name: 'Luomuliero',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.luomuliero.fi/icons/apple-touch-icon.png',
        },
      },
      mainEntityOfPage: `${SITE_URL}/blogi/julkaisu/${slug}`,
    },
  ];

  return {
    props: { data, content: htmlContent, recommendedPosts, structuredData },
  };
};

export { getStaticPaths, getStaticProps };
