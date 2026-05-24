export const DELIVERY_BREAK_HEADING = 'Kesäloman käsittelytauko';
export const DELIVERY_BREAK_START_DATE = '2026-06-29';
export const DELIVERY_BREAK_END_DATE = '2026-07-12';
export const DELIVERY_BREAK_LAST_PRE_BREAK_ORDER_DATE = '2026-06-28';
export const DELIVERY_BREAK_LAST_PRE_BREAK_SHIPPING_DATE = '2026-06-29';
export const DELIVERY_BREAK_NEXT_SHIPPING_DATE = '2026-07-13';

export const DELIVERY_BREAK_SHORT_NOTICE =
  'Tilauksia voi tehdä normaalisti, mutta niitä ei käsitellä, vahvisteta eikä toimiteta 29.6.–12.7.2026. Viimeiset ennen lomaa lähtevät tilaukset postitetaan 29.6., ja seuraavia tilauksia käsitellään 13.7. alkaen.';

export const DELIVERY_BREAK_FULL_NOTICE_PARAGRAPHS = [
  'Tilauksia voi tehdä normaalisti myös kesäloman aikana, mutta Lieromaan tilauksia ei käsitellä, vahvisteta eikä toimiteta 29.6.–12.7.2026. 28.6. mennessä tehdyt tilaukset postitetaan vielä 29.6. Seuraavia tilauksia käsitellään, vahvistetaan ja toimitetaan 13.7. alkaen.',
  'Loman aikana tehdyt tilaukset käsitellään loman päätyttyä saapumisjärjestyksessä. Mikäli tilausmäärä on suuri, osa tilauksista voidaan joutua siirtämään 20.7. tai 27.7. lähetyksiin.',
];

function isDateOnly(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
}

export function adjustShippingDateForDeliveryBreak({ estimatedShippingDate, orderDate }) {
  if (!isDateOnly(estimatedShippingDate) || !isDateOnly(orderDate)) {
    return estimatedShippingDate;
  }

  if (
    estimatedShippingDate < DELIVERY_BREAK_START_DATE ||
    estimatedShippingDate > DELIVERY_BREAK_END_DATE
  ) {
    return estimatedShippingDate;
  }

  return orderDate <= DELIVERY_BREAK_LAST_PRE_BREAK_ORDER_DATE
    ? DELIVERY_BREAK_LAST_PRE_BREAK_SHIPPING_DATE
    : DELIVERY_BREAK_NEXT_SHIPPING_DATE;
}
