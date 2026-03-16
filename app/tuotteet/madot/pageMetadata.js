import { getProductCatalogEntry } from '@/data/productCatalog.mjs';

const product = getProductCatalogEntry('worms');

export const pageName = product.pageName;
export const title = product.title;
export const description = product.description;
export const canonicalUrl = product.canonicalUrl;
export const pageUrl = product.pageUrl;
export const pageId = product.pageId;
export const pageDescription = product.pageDescription;
export const image = product.image;
export const imageUrl = product.imageUrl;
export const galleryImages = product.images;
export const productImageUrls = product.productImageUrls;
export const productId = product.productId;
export const productName = product.productName;
export const productDescription = product.productDescription;
export const h1 = product.h1;

export default product.metadata;
