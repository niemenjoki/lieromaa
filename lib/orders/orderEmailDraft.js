import { ORDER_EMAIL_FALLBACK, ORDER_SUPPORT_EMAIL } from '@/lib/copy/orderMessages';
import { formatCurrency } from '@/lib/pricing/catalog';

export function buildOrderEmailDraft({
  language = 'fi',
  items = [],
  customer = {},
  address = {},
  shippingLabel = '',
  pickupPoint,
  paymentLabel = '',
  discountCode = '',
  total,
}) {
  const copy = ORDER_EMAIL_FALLBACK[language] || ORDER_EMAIL_FALLBACK.fi;
  const lines = [copy.unconfirmed, '', `${copy.products}:`];
  for (const item of items) {
    lines.push(`${item.quantity} × ${item.label}`);
    if (item.extras?.length) lines.push(`  ${copy.extras}: ${item.extras.join(', ')}`);
  }
  lines.push('');
  const add = (label, value) => {
    if (String(value ?? '').trim()) lines.push(`${label}: ${String(value).trim()}`);
  };
  add(copy.name, customer.name);
  add(copy.email, customer.email);
  add(copy.phone, customer.phone);
  add(copy.shipping, shippingLabel);
  add(
    copy.address,
    [address.line1, address.postalCode, address.city].filter(Boolean).join(', ')
  );
  if (pickupPoint) {
    add(
      copy.pickup,
      [
        pickupPoint.name,
        pickupPoint.careOf,
        pickupPoint.street,
        pickupPoint.postalCode,
        pickupPoint.city || pickupPoint.municipality,
        pickupPoint.specificLocation,
      ]
        .filter(Boolean)
        .join(', ')
    );
  }
  add(copy.payment, paymentLabel);
  add(copy.discount, discountCode);
  if (Number.isFinite(total)) add(copy.total, formatCurrency(total, language));
  add(copy.message, customer.message);
  const body = lines.join('\n');
  const text = `${copy.subjectLabel}: ${copy.subject}\n\n${body}`;
  return {
    to: ORDER_SUPPORT_EMAIL,
    text,
    href: `mailto:${ORDER_SUPPORT_EMAIL}?subject=${encodeURIComponent(copy.subject)}&body=${encodeURIComponent(body)}`,
  };
}
