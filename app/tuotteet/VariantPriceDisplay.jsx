import { formatPrice } from '@/lib/pricing/catalog';

import classes from './ProductPage.module.css';

const discountDateFormatter = new Intl.DateTimeFormat('fi-FI', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
});

function formatDiscountLabel(discount) {
  if (!discount) {
    return '';
  }

  return discount.type === 'percentage'
    ? `-${formatPrice(discount.value)} %`
    : `-${formatPrice(discount.amount)} €`;
}

function formatDiscountValidUntil(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : discountDateFormatter.format(date);
}

export default function VariantPriceDisplay({ title, variant }) {
  const discount = variant.discount;

  return (
    <span className={classes.VariantPriceDisplay}>
      <span className={classes.VariantPriceTitle}>{title}</span>

      {discount ? (
        <>
          <span className={classes.VariantPriceRow}>
            <span className={classes.DiscountedPrice}>
              {formatPrice(variant.price)} €
            </span>
            <span className={classes.OriginalPrice}>
              {formatPrice(variant.basePrice)} €
            </span>
            <span className={classes.DiscountBadge}>{formatDiscountLabel(discount)}</span>
          </span>
          <span className={classes.LowestPriceNotice}>
            30 päivän alin hinta: {formatPrice(discount.lowestPrice30Days)} €. Tarjous
            voimassa {formatDiscountValidUntil(discount.validUntil)} asti.
          </span>
        </>
      ) : (
        <span className={classes.RegularPrice}>{formatPrice(variant.price)} €</span>
      )}
    </span>
  );
}
