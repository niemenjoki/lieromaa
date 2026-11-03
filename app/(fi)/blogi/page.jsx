import generateBlogPageMetadata from '../blogi/sivu/[pageIndex]/generateMetadata';
import BlogPage from './sivu/[pageIndex]/page';

export async function generateMetadata() {
  return await generateBlogPageMetadata({ params: { pageIndex: '1' } });
}

export default async function BlogRoot() {
  return await BlogPage({ params: { pageIndex: '1' } });
}
