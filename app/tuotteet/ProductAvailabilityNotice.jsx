'use client';

import { useEffect, useState } from 'react';

import {
  getTodayInBusinessTimeZone,
  getVisibleEarliestShippingDate,
} from '@/lib/commerce/shippingEstimate.mjs';
import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';
import { getProductAvailability, getProductPricing } from '@/lib/pricing/catalog';

export { getTodayInBusinessTimeZone, getVisibleEarliestShippingDate };

export default function ProductAvailabilityNotice({
  productKey,
  className = '',
  prefix = '',
  context = 'product',
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

  if (context === 'starterKitWormSelection') {
    if (hasUnavailableSkus && hasEarliestShippingDate) {
      noticeText =
        'Isompien matopakettien saatavuutta on rajoitettu suuren kysynnän vuoksi. Jos lisäät matoja aloituspakkaukseen, koko tilaus toimitetaan matojen saatavuuden mukaan aikaisintaan ';
    } else if (hasUnavailableSkus) {
      noticeText =
        'Isompien matopakettien saatavuutta on rajoitettu suuren kysynnän vuoksi. Jos lisäät matoja aloituspakkaukseen, koko tilaus toimitetaan matojen saatavuuden mukaan.';
    } else {
      noticeText =
        'Jos lisäät matoja aloituspakkaukseen, koko tilaus toimitetaan matojen saatavuuden mukaan aikaisintaan ';
    }
  } else if (hasUnavailableSkus && hasEarliestShippingDate) {
    noticeText =
      'Olen joutunut rajoittamaan isompien matopakettien myyntiä sekä viivästyttämään tilausten lähettämistä suuren kysynnän vuoksi. Pienempiä tilauksia voi tehdä normaalisti. Nyt tehtävät tilaukset toimitetaan ';
  } else if (hasUnavailableSkus) {
    noticeText =
      'Olen joutunut rajoittamaan isompien matopakettien myyntiä suuren kysynnän vuoksi. Pienempiä tilauksia voi tehdä normaalisti.';
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
