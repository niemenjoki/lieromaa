import { createProductPageMetadata } from '@/lib/metadata/createProductPageMetadata';

import pageMetadata from './pageMetadata';

export default function generateMetadata() {
  return createProductPageMetadata('worms', pageMetadata);
}
