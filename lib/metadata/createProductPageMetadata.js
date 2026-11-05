import { formatPrice, getAvailableProductVariants } from '@/lib/pricing/catalog';

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

// Search engines cut meta descriptions after 160 characters.
const MAX_DESCRIPTION_LENGTH = 160;

function getDiscountDescriptions(productKey, now) {
  const variants = getAvailableProductVariants(productKey, { now });
  const activeDiscounts = variants.map((variant) => variant.discount).filter(Boolean);

  if (activeDiscounts.length === 0) {
    return [];
  }

  const lowestCurrentPrice = Math.min(...variants.map((variant) => variant.price));
  const priceDescription = ` Nyt alkaen ${formatPrice(lowestCurrentPrice)} €`;
  const validUntilDates = [
    ...new Set(activeDiscounts.map((discount) => discount.validUntil)),
  ]
    .filter(Boolean)
    .sort();

  if (validUntilDates.length === 0) {
    return [`${priceDescription}.`];
  }

  const validUntilText =
    validUntilDates.length === 1
      ? `${formatMetadataDate(validUntilDates[0])} asti`
      : `SKU-kohtaisesti, aikaisintaan ${formatMetadataDate(validUntilDates[0])} asti`;

  // Longest first: the end date is dropped when it would not fit the limit.
  return [`${priceDescription} (${validUntilText}).`, `${priceDescription}.`];
}

export function createProductPageMetadata(productKey, pageMetadata, { now } = {}) {
  const description =
    getDiscountDescriptions(productKey, now)
      .map((discountDescription) => `${pageMetadata.description}${discountDescription}`)
      .find((candidate) => candidate.length <= MAX_DESCRIPTION_LENGTH) ??
    pageMetadata.description;

  return createPageMetadata({
    ...pageMetadata,
    description,
  });
}
