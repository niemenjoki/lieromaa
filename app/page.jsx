import BlogPage from './blogi/sivu/[pageIndex]/page';

export default async function HomePage() {
  return await BlogPage({ params: { pageIndex: '1' } });
}
