import { formatPrice, getProductVariants } from '@/lib/pricing/catalog';

import { createPageMetadata } from './createPageMetadata';

const metadataDateFormatter = new Intl.DateTimeFormat('fi-FI', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
});

function formatMetadataDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : metadataDateFormatter.format(date);
}

function getDiscountDescription(productKey) {
  const variants = getProductVariants(productKey);
  const activeDiscounts = variants.map((variant) => variant.discount).filter(Boolean);

  if (activeDiscounts.length === 0) {
    return '';
  }

  const lowestCurrentPrice = Math.min(...variants.map((variant) => variant.price));
  const validUntilDates = [
    ...new Set(activeDiscounts.map((discount) => discount.validUntil)),
  ]
    .filter(Boolean)
    .sort();

  if (validUntilDates.length === 0) {
    return ` Aktiivinen tarjous: hinnat nyt alkaen ${formatPrice(lowestCurrentPrice)} €.`;
  }

  const validUntilText =
    validUntilDates.length === 1
      ? `Tarjous voimassa ${formatMetadataDate(validUntilDates[0])} asti.`
      : `Tarjoushinnat voimassa SKU-kohtaisesti, aikaisintaan ${formatMetadataDate(validUntilDates[0])} asti.`;

  return ` Aktiivinen tarjous: hinnat nyt alkaen ${formatPrice(lowestCurrentPrice)} €. ${validUntilText}`;
}

export function createProductPageMetadata(productKey, pageMetadata) {
  const discountDescription = getDiscountDescription(productKey);

  return createPageMetadata({
    ...pageMetadata,
    description: `${pageMetadata.description}${discountDescription}`,
  });
}
