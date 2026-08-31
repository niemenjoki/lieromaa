export const PENDING_STRIPE_LIFETIME_MS = 60 * 60 * 1000;

const SESSION_PATTERN = /^cs_(?:test|live)_[A-Za-z0-9]+$/;

function text(value, maxLength) {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

export function createPendingStripeCheckout(value, { now = Date.now() } = {}) {
  const savedAt = Number(now);
  const suppliedExpiry = new Date(value?.expiresAt || '').getTime();
  const expiresAt = Number.isFinite(suppliedExpiry)
    ? suppliedExpiry
    : savedAt + PENDING_STRIPE_LIFETIME_MS;

  return {
    version: 1,
    savedAt,
    expiresAt,
    sessionId: text(value?.sessionId, 255),
    orderId: text(value?.orderId, 160),
    sourceRequestId: text(value?.sourceRequestId, 160),
    cartFingerprint: text(value?.cartFingerprint, 160),
  };
}

export function parsePendingStripeCheckout(serialized, { now = Date.now() } = {}) {
  try {
    const value = JSON.parse(serialized);
    const currentTime = Number(now);
    if (
      !value ||
      typeof value !== 'object' ||
      Array.isArray(value) ||
      value.version !== 1 ||
      !Number.isFinite(value.savedAt) ||
      !Number.isFinite(value.expiresAt) ||
      value.savedAt > currentTime ||
      value.expiresAt <= currentTime ||
      value.expiresAt - value.savedAt > PENDING_STRIPE_LIFETIME_MS + 60_000
    ) {
      return null;
    }

    const pending = createPendingStripeCheckout(value, { now: value.savedAt });
    return SESSION_PATTERN.test(pending.sessionId) && pending.sourceRequestId
      ? pending
      : null;
  } catch {
    return null;
  }
}
