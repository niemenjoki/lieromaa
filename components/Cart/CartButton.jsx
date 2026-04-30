'use client';

import Icon from '@/components/Icon/Icon';
import SafeLink from '@/components/SafeLink/SafeLink';

import classes from './CartButton.module.css';
import { useCart } from './CartProvider';

export default function CartButton() {
  const { itemCount, isHydrated } = useCart();
  const visibleCount = isHydrated ? itemCount : 0;
  const label = visibleCount > 0 ? `Ostoskori, ${visibleCount} tuotetta` : 'Ostoskori';

  return (
    <SafeLink href="/tilaus" className={classes.CartButton} aria-label={label}>
      <Icon name="cart" aria-hidden="true" />
      {visibleCount > 0 ? <span className={classes.Count}>{visibleCount}</span> : null}
    </SafeLink>
  );
}
