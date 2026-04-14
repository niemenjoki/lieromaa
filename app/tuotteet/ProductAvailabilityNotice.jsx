'use client';

import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';
import { getProductAvailability } from '@/lib/pricing/catalog';

export default function ProductAvailabilityNotice({
  productKey,
  className = '',
  prefix = '',
}) {
  const availability = getProductAvailability(productKey);
  const hasUnavailableSkus = availability.unavailableSkus.length > 0;
  const hasEarliestShippingDate = Boolean(availability.earliestShippingDate);

  if (!hasUnavailableSkus && !hasEarliestShippingDate) {
    return null;
  }

  const formattedEarliestShippingDate = hasEarliestShippingDate
    ? formatFinnishDate(availability.earliestShippingDate, 'numeric')
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
