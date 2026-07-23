import {
  HOT_COMPOSTING_CATEGORY_NAME,
  HOT_COMPOSTING_GUIDES,
} from '@/lib/content/hotCompostingGuide.mjs';
import { getContentMetadata, getGuideCategoryPageData } from '@/lib/content/index.mjs';
import { withDefaultMetadata } from '@/lib/metadata/withDefaultMetadata';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';

function toSocialImage(image) {
  return {
    url: image.url,
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
}

export default async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  const pageData = getGuideCategoryPageData(categorySlug);
  const isHotCompostingCategory = pageData.categoryName === HOT_COMPOSTING_CATEGORY_NAME;
  const mainGuideImage = isHotCompostingCategory
    ? getContentMetadata({
        type: CONTENT_TYPES.GUIDE,
        slug: HOT_COMPOSTING_GUIDES[0].slug,
      }).image
    : null;
  const socialImage = mainGuideImage ? toSocialImage(mainGuideImage) : null;

  const customMetadata = {
    title: pageData.title,
    description: pageData.description,
    alternates: {
      canonical: pageData.pagePath,
    },
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: pageData.pagePath,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
    ...(socialImage
      ? {
          twitter: {
            title: pageData.title,
            description: pageData.description,
            images: [socialImage],
          },
        }
      : {}),
  };

  return withDefaultMetadata(customMetadata);
}
