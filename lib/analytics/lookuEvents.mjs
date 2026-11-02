const EVENT_NAME_PATTERN = /^[a-z0-9_.-]{1,40}$/;

function normalizeEventItems(value) {
  return (Array.isArray(value) ? value : [])
    .map((item) => ({
      sku: String(item?.sku || '')
        .trim()
        .slice(0, 80),
      quantity: Math.max(1, Math.min(100, Math.round(Number(item?.quantity) || 1))),
    }))
    .filter((item) => item.sku)
    .slice(0, 20);
}

// Maps the site's analytics event (trackAnalyticsEvent) to a Looku event. Looku's
// value is a number, so the site's text value goes to props.value.
export function toLookuEvent({
  eventName,
  eventTarget = '',
  eventValue = '',
  eventItems,
} = {}) {
  const name = String(eventName || '').trim();
  if (!EVENT_NAME_PATTERN.test(name)) {
    return null;
  }

  const options = {};
  const target = String(eventTarget || '')
    .trim()
    .slice(0, 120);
  const value = String(eventValue || '')
    .trim()
    .slice(0, 120);
  const items = normalizeEventItems(eventItems);

  if (target) options.target = target;
  if (value) options.props = { value };
  if (items.length > 0) options.items = items;

  return { name, options };
}
