import { ORDER_CONTACT_EMAIL } from '@/data/site/contact';

export const REVIEW_SESSION_ENDPOINT = '/api/reviews/session';
export const REVIEW_SUBMIT_ENDPOINT = '/api/reviews/submit';
export const REVIEW_SUPPORT_EMAIL = ORDER_CONTACT_EMAIL;
export const REVIEW_SUCCESS_MESSAGE =
  'Kiitos arvostelusta! Se tallennettiin tarkistettavaksi ja näkyy sivustolla, kun se on tarkastettu roskapostin varalta.';
export const REVIEW_ERROR_MESSAGE = `Arvostelun lähetys epäonnistui. Yritä hetken kuluttua uudelleen tai ota yhteyttä osoitteeseen ${REVIEW_SUPPORT_EMAIL}.`;
