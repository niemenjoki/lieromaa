'use client';

import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';
import { getProductAvailability } from '@/lib/pricing/catalog';

export default function ProductAvailabilityNotice({
  productKey,
  className = '',
  prefix = '',
}) {
  const availability = getProductAvailability(productKey);

  if (!availability.earliestShippingDate) {
    return null;
  }

  return (
    <p className={className}>
      {prefix ? (
        <>
          <strong>{prefix}</strong>{' '}
        </>
      ) : null}
      Saatavuus on tilapäisesti rajallinen suuren kysynnän vuoksi. Tilauksia voi tehdä
      normaalisti, mutta tämän hetken tilaukset toimitetaan aikaisintaan{' '}
      {formatFinnishDate(availability.earliestShippingDate, 'numeric')}.
    </p>
  );
}
