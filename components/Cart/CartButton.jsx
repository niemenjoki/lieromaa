'use client';

import Icon from '@/components/Icon/Icon';
import SafeLink from '@/components/SafeLink/SafeLink';
import { getRoutePath } from '@/lib/i18n/routes.mjs';

import classes from './CartButton.module.css';
import { useCart } from './CartProvider';

export default function CartButton({ language, copy }) {
  const { itemCount, isHydrated } = useCart();
  const visibleCount = isHydrated ? itemCount : 0;
  const label =
    visibleCount === 0
      ? copy.emptyLabel
      : (visibleCount === 1 ? copy.oneItemLabel : copy.itemLabel).replace(
          '{count}',
          String(visibleCount)
        );

  return (
    <SafeLink
      href={getRoutePath('checkout', language)}
      className={classes.CartButton}
      aria-label={label}
    >
      <Icon name="cart" aria-hidden="true" />
      {visibleCount > 0 ? <span className={classes.Count}>{visibleCount}</span> : null}
    </SafeLink>
  );
}
