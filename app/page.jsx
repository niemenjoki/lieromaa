import BlogPage from './blogi/sivu/[pageIndex]/page';

export { default as generateMetadata } from './blogi/sivu/[pageIndex]/generateMetadata';

export default async function HomePage() {
  return await BlogPage({ params: { pageIndex: '1' } });
}
