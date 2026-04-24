const defaultProductAvailability = Object.freeze({
  earliestShippingDate: false, // 'YYYY-MM-DD'
  unavailableSkus: [],
});

export const productAvailabilitySource = {
  worms: {
    earliestShippingDate: '2026-05-11', // 'YYYY-MM-DD'
    unavailableSkus: ['worms-200'], // '[worms-x]'
  },
  starterKit: {
    earliestShippingDate: '2026-05-11', // 'YYYY-MM-DD'
    unavailableSkus: ['starterkit-200'], // '[starterkit-x]'
  },
};

function normalizeEarliestShippingDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : false;
}

function normalizeUnavailableSkus(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((entry) => typeof entry === 'string' && entry.trim()))];
}

export function getProductAvailabilityConfig(productKey) {
  const configuredValue =
    productAvailabilitySource[productKey] ?? defaultProductAvailability;
  const earliestShippingDate = normalizeEarliestShippingDate(
    configuredValue.earliestShippingDate
  );
  const unavailableSkus = normalizeUnavailableSkus(configuredValue.unavailableSkus);

  return {
    earliestShippingDate,
    unavailableSkus,
    hasLimitedAvailability: Boolean(earliestShippingDate),
  };
}

export default productAvailabilitySource;
