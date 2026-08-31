export const CHECKOUT_DRAFT_LIFETIME_MS = 60 * 60 * 1000;

const CHECKOUT_DRAFT_VERSION = 1;

function text(value, maxLength) {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

function normalizePickupPoint(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  return {
    id: text(value.id, 160),
    name: text(value.name, 240),
    careOf: text(value.careOf, 240),
    street: text(value.street, 240),
    postalCode: text(value.postalCode, 16),
    city: text(value.city, 160),
    municipality: text(value.municipality, 160),
    specificLocation: text(value.specificLocation, 500),
    parcelLocker: Boolean(value.parcelLocker),
    routingServiceCode: text(value.routingServiceCode, 80),
    distanceInMeters: Number.isFinite(Number(value.distanceInMeters))
      ? Number(value.distanceInMeters)
      : null,
  };
}

export function createCheckoutDraft(value, { now = Date.now() } = {}) {
  const savedAt = Number(now);

  return {
    version: CHECKOUT_DRAFT_VERSION,
    savedAt,
    expiresAt: savedAt + CHECKOUT_DRAFT_LIFETIME_MS,
    language: value?.language === 'en' ? 'en' : 'fi',
    cartFingerprint: text(value?.cartFingerprint, 160),
    sourceRequestId: text(value?.sourceRequestId, 160),
    formStartedAt: text(value?.formStartedAt, 40),
    shippingMethod: text(value?.shippingMethod, 120),
    addressFields: {
      line1: text(value?.addressFields?.line1, 240),
      postalCode: text(value?.addressFields?.postalCode, 16),
      city: text(value?.addressFields?.city, 160),
    },
    customerFields: {
      name: text(value?.customerFields?.name, 240),
      email: text(value?.customerFields?.email, 320),
      phone: text(value?.customerFields?.phone, 80),
      message: text(value?.customerFields?.message, 4000),
    },
    selectedPickupPoint: normalizePickupPoint(value?.selectedPickupPoint),
    paymentProvider: ['INVOICE', 'STRIPE'].includes(value?.paymentProvider)
      ? value.paymentProvider
      : '',
    discountCodeInput: text(value?.discountCodeInput, 80),
    appliedDiscountCode: text(value?.appliedDiscountCode, 80),
  };
}

export function parseCheckoutDraft(serialized, { now = Date.now() } = {}) {
  try {
    const value = JSON.parse(serialized);
    const currentTime = Number(now);
    if (
      !value ||
      typeof value !== 'object' ||
      Array.isArray(value) ||
      value.version !== CHECKOUT_DRAFT_VERSION ||
      !Number.isFinite(value.savedAt) ||
      !Number.isFinite(value.expiresAt) ||
      value.savedAt > currentTime ||
      value.expiresAt <= currentTime ||
      value.expiresAt - value.savedAt !== CHECKOUT_DRAFT_LIFETIME_MS
    ) {
      return null;
    }

    const draft = createCheckoutDraft(value, { now: value.savedAt });
    if (
      !draft.cartFingerprint ||
      !draft.sourceRequestId ||
      !draft.shippingMethod ||
      !draft.paymentProvider
    ) {
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}
