'use client';

import { useEffect, useState } from 'react';

import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';
import { getProductAvailability, getProductPricing } from '@/lib/pricing/catalog';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const BUSINESS_TIME_ZONE = 'Europe/Helsinki';

function parseISODate(date) {
  const [year, month, day] = String(date).split('-').map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}

function getTodayInTimeZone(timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(new Date());
  const getPartValue = (type) => Number(parts.find((part) => part.type === type)?.value);

  return new Date(
    Date.UTC(getPartValue('year'), getPartValue('month') - 1, getPartValue('day'))
  );
}

export function getTodayInBusinessTimeZone() {
  return getTodayInTimeZone(BUSINESS_TIME_ZONE);
}

export function getVisibleEarliestShippingDate({
  earliestShippingDate,
  normalHandlingWindowDays,
  now = new Date(),
}) {
  if (!earliestShippingDate) {
    return false;
  }

  if (!Number.isFinite(normalHandlingWindowDays) || normalHandlingWindowDays < 0) {
    return earliestShippingDate;
  }

  const today = getTodayInTimeZone(BUSINESS_TIME_ZONE);
  const referenceDate = now instanceof Date && !Number.isNaN(now.getTime()) ? now : today;
  const targetDate = parseISODate(earliestShippingDate);
  const daysUntilShipping = Math.round(
    (targetDate.getTime() - referenceDate.getTime()) / DAY_IN_MS
  );

  return daysUntilShipping > normalHandlingWindowDays ? earliestShippingDate : false;
}

export default function ProductAvailabilityNotice({
  productKey,
  className = '',
  prefix = '',
}) {
  const availability = getProductAvailability(productKey);
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
    ? formatFinnishDate(visibleEarliestShippingDate, 'numeric')
    : '';

  let noticeText = '';

  if (hasUnavailableSkus && hasEarliestShippingDate) {
    noticeText =
      'Olen joutunut rajoittamaan isompien matomäärien myyntiä sekä viivästyttämään tilausten lähettämistä suuren kysynnän vuoksi. Pienempiä tilauksia voi tehdä normaalisti. Nyt tehtävät tilaukset toimitetaan ';
  } else if (hasUnavailableSkus) {
    noticeText =
      'Olen joutunut rajoittamaan isompien matomäärien myyntiä suuren kysynnän vuoksi. Pienempiä tilauksia voi tehdä normaalisti.';
  } else {
    noticeText =
      'Joudun viivästyttämään tilausten lähettämistä suuren kysynnän vuoksi. Nyt tehtävät tilaukset toimitetaan ';
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
