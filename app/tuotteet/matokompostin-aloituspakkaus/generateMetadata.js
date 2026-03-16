import { createPageMetadata } from '@/lib/metadata/createPageMetadata';

import pageMetadata from './pageMetadata';

export default function generateMetadata() {
  return createPageMetadata(pageMetadata);
}
