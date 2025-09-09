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

const PostPage = ({ data, content, recommendedPosts = [] }) => {
  const { title, date, tags, excerpt } = data;
  return (
    <Layout title={title + ' | Luomuliero'} ads={true} description={excerpt}>
      <article className={classes.PostPage}>
        <h1>{title}</h1>
        <div className={classes.Date}>
          Julkaistu: {new Date(date).toLocaleDateString()}
        </div>
        <div
          className={classes.Content}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </article>
      <SocialShareButtons title={title} text={excerpt} tags={tags} />
      <Advert adClient="" adSlot="" />
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
  return {
    props: { data, content: htmlContent, recommendedPosts },
  };
};

export { getStaticPaths, getStaticProps };
