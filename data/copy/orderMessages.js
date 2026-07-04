import { ORDER_CONTACT_EMAIL } from '@/data/site/contact';

export const ORDER_SUBMIT_ENDPOINT = '/api/orders/submit';
export const ORDER_FORM_MIN_FILL_MS = 1500;
export const ORDER_SUPPORT_EMAIL = ORDER_CONTACT_EMAIL;
export const ORDER_SUCCESS_MESSAGE =
  'Kiitos tilauksesta! Tilaus on vastaanotettu. Kesäloman 29.6.–12.7.2026 aikana tehdyt tilaukset käsitellään loman jälkeen saapumisjärjestyksessä.';
export const ORDER_ERROR_MESSAGE = `Tilauksen lähetys epäonnistui. Yritä hetken kuluttua uudelleen tai tee tilaus sähköpostitse osoitteeseen ${ORDER_SUPPORT_EMAIL}.`;
