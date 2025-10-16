import BlogPage from './blogi/sivu/[pageIndex]/page';

export default async function Home() {
  return <BlogPage currentPage={1} />;
}

export const dynamicParams = false;
