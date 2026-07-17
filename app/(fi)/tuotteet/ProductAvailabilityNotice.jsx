'use client';

import { useEffect, useState } from 'react';

import {
  getTodayInBusinessTimeZone,
  getVisibleEarliestShippingDate,
} from '@/lib/commerce/shippingEstimate.mjs';
import { formatDate } from '@/lib/i18n/formatters.mjs';
import { getProductMessages } from '@/lib/i18n/messages.mjs';
import { getProductAvailability, getProductPricing } from '@/lib/pricing/catalog';

export { getTodayInBusinessTimeZone, getVisibleEarliestShippingDate };

export default function ProductAvailabilityNotice({
  productKey,
  className = '',
  prefix = '',
  language = 'fi',
}) {
  const availability = getProductAvailability(productKey);
  const copy = getProductMessages(language).availability;
  const product = getProductPricing(productKey);
  const hasUnavailableSkus = availability.unavailableSkus.length > 0;
  const normalHandlingWindowDays = Number(product?.schema?.handlingTime?.maxValue);
  const [visibleEarliestShippingDate, setVisibleEarliestShippingDate] = useState(
    availability.earliestShippingDate
  );

  useEffect(() => {
    setVisibleEarliestShippingDate(
      getVisibleEarliestShippingDate({
        earliestShippingDate: availability.earliestShippingDate,
        normalHandlingWindowDays,
        now: getTodayInBusinessTimeZone(),
      })
    );
  }, [availability.earliestShippingDate, normalHandlingWindowDays]);

  const hasEarliestShippingDate = Boolean(visibleEarliestShippingDate);

  if (!hasUnavailableSkus && !hasEarliestShippingDate) {
    return null;
  }

  const formattedEarliestShippingDate = hasEarliestShippingDate
    ? formatDate(visibleEarliestShippingDate, language, 'numeric')
    : '';

  let noticeText = '';

  if (hasUnavailableSkus && hasEarliestShippingDate) {
    noticeText = copy.limitedAndDelayed;
  } else if (hasUnavailableSkus) {
    noticeText = copy.limited;
  } else {
    noticeText = copy.delayed;
  }

  return (
    <p className={className}>
      {prefix ? (
        <>
          <strong>{prefix}</strong>{' '}
        </>
      ) : null}
      {noticeText}
      {hasEarliestShippingDate ? `${formattedEarliestShippingDate}.` : null}
    </p>
  );
}
