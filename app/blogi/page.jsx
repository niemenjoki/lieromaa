import BlogPage from './sivu/[pageIndex]/page';

export default async function BlogRoot() {
  return <BlogPage currentPage={1} />;
}

export const dynamicParams = false;
