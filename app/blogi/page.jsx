import BlogPage from './sivu/[pageIndex]/page';

export default async function BlogRoot() {
  return await BlogPage({ params: { pageIndex: '1' } });
}
