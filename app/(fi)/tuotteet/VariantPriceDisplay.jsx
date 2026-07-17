import { formatDate } from '@/lib/i18n/formatters.mjs';
import { getProductMessages } from '@/lib/i18n/messages.mjs';
import { formatCurrency, formatPrice } from '@/lib/pricing/catalog';

import classes from './ProductPage.module.css';

function formatDiscountLabel(discount, language) {
  if (!discount) {
    return '';
  }

  return discount.type === 'percentage'
    ? `-${formatPrice(discount.value, language)} %`
    : `-${formatPrice(discount.amount, language)} €`;
}

function formatDiscountValidUntil(value, language) {
  try {
    return formatDate(value, language, 'numeric');
  } catch {
    return value;
  }
}

export default function VariantPriceDisplay({ title, variant, language }) {
  const discount = variant.discount;
  const copy = getProductMessages(language).price;

  if (!variant.isAvailable) {
    return (
      <span className={classes.VariantPriceDisplay}>
        <span className={classes.VariantPriceTitle}>{title}</span>
        <span className={classes.VariantPriceRow}>
          <span className={classes.RegularPrice}>
            {formatCurrency(variant.price, language)}
          </span>
          <span className={classes.OutOfStockBadge}>{copy.unavailable}</span>
        </span>
      </span>
    );
  }

  return (
    <span className={classes.VariantPriceDisplay}>
      <span className={classes.VariantPriceTitle}>{title}</span>

      {discount ? (
        <>
          <span className={classes.VariantPriceRow}>
            <span className={classes.DiscountedPrice}>
              {formatCurrency(variant.price, language)}
            </span>
            <span className={classes.OriginalPrice}>
              {formatCurrency(variant.basePrice, language)}
            </span>
            <span className={classes.DiscountBadge}>
              {formatDiscountLabel(discount, language)}
            </span>
          </span>
          <span className={classes.LowestPriceNotice}>
            {copy.lowestPricePrefix}{' '}
            {formatCurrency(discount.lowestPrice30Days, language)}. {copy.offerValid}{' '}
            {formatDiscountValidUntil(discount.validUntil, language)}
            {copy.offerUntil}
          </span>
        </>
      ) : (
        <span className={classes.RegularPrice}>
          {formatCurrency(variant.price, language)}
        </span>
      )}
    </span>
  );
}
