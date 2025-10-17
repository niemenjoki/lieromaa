import { getAllPosts } from '@/utils/mdx';

const MAX_RECOMMENDATIONS = 2;
const MIN_COMMON_KEYWORDS = 3;

const getPostRecommendations = async ({ self, keywords }) => {
  const targetKeywords = keywords.map((k) => k.trim().toLowerCase());

  const posts = getAllPosts();

  const recommendations = posts
    .filter((post) => post.slug !== self)
    .map((post) => {
      const postKeywords = (post.keywords || []).map((k) => k.trim().toLowerCase());
      const commonKeywords = postKeywords.filter((k) =>
        targetKeywords.includes(k)
      ).length;

      return { ...post, commonKeywords };
    })
    .filter((post) => post.commonKeywords >= MIN_COMMON_KEYWORDS)
    .sort((a, b) => b.commonKeywords - a.commonKeywords)
    .slice(0, MAX_RECOMMENDATIONS);

  return recommendations;
};

export default getPostRecommendations;
