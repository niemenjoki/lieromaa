import { getProductCatalogEntry } from '@/lib/products/catalog.mjs';

const product = getProductCatalogEntry('starterKit');

export const pageName = product.pageName;
export const title = product.title;
export const description = product.description;
export const canonicalUrl = product.canonicalUrl;
export const pageUrl = product.pageUrl;
export const pageId = product.pageId;
export const image = product.image;
export const imageUrl = product.imageUrl;
export const galleryImages = product.images;
export const productImageUrls = product.productImageUrls;
export const breadcrumbItems = product.breadcrumbItems;
export const productId = product.productId;
export const productName = product.productName;
export const productDescription = product.productDescription;
export const faqId = product.faqId;
export const faqItems = product.faqItems;
export const h1 = product.h1;

export default product.metadata;
