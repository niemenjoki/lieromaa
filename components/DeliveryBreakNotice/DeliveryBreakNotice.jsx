'use client';

import { usePathname } from 'next/navigation';

import {
  DELIVERY_BREAK_FULL_NOTICE_PARAGRAPHS,
  DELIVERY_BREAK_HEADING,
  DELIVERY_BREAK_SHORT_NOTICE,
} from '@/lib/commerce/deliveryBreak.mjs';

import classes from './DeliveryBreakNotice.module.css';

export function DeliveryBreakBanner() {
  const pathname = usePathname();

  if (pathname === '/tilaus') {
    return null;
  }

  return (
    <aside className={classes.Banner} aria-label={DELIVERY_BREAK_HEADING}>
      <div className={classes.BannerInner}>
        <p className={classes.BannerText}>
          <strong className={classes.Heading}>{DELIVERY_BREAK_HEADING}:</strong>{' '}
          {DELIVERY_BREAK_SHORT_NOTICE}
        </p>
      </div>
    </aside>
  );
}

export function DeliveryBreakCheckoutNotice() {
  return (
    <aside className={classes.CheckoutNotice} aria-label={DELIVERY_BREAK_HEADING}>
      <h2>{DELIVERY_BREAK_HEADING}</h2>
      {DELIVERY_BREAK_FULL_NOTICE_PARAGRAPHS.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </aside>
  );
}
