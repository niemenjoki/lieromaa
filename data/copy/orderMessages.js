import { ORDER_CONTACT_EMAIL } from '@/data/site/contact';

export const ORDER_SUBMIT_ENDPOINT = '/api/orders/submit';
export const ORDER_FORM_MIN_FILL_MS = 1500;
export const ORDER_SUPPORT_EMAIL = ORDER_CONTACT_EMAIL;
export const ORDER_SUCCESS_MESSAGE =
  'Kiitos tilauksesta! Tilaus on vastaanotettu. Saat manuaalisen vahvistuksen sähköpostiisi 1–2 arkipäivän sisällä.';
export const ORDER_ERROR_MESSAGE = `Tilauksen lähetys epäonnistui. Yritä hetken kuluttua uudelleen tai tee tilaus sähköpostitse osoitteeseen ${ORDER_SUPPORT_EMAIL}.`;

export const ORDER_EMAIL_FALLBACK = {
  fi: {
    unavailable:
      'Tilauspalvelu on tilapäisesti poissa käytöstä. Voit yrittää myöhemmin uudelleen tai lähettää tilauksen sähköpostitse.',
    subject: 'Tilaus Lieromaasta',
    unconfirmed: 'Verkkolomakkeen lähetys ei saanut vahvistusta.',
    recipient: 'Vastaanottaja',
    subjectLabel: 'Aihe',
    draft: 'Tilausviesti',
    send: 'Lähetä tilaus sähköpostitse',
    copy: 'Kopioi tilausteksti',
    copied: 'Tilausteksti kopioitu.',
    copyFailed: 'Kopiointi ei onnistunut. Voit valita ja kopioida yllä olevan tekstin.',
    products: 'Tuotteet',
    extras: 'Lisävalinnat',
    name: 'Nimi',
    email: 'Sähköposti',
    phone: 'Puhelinnumero',
    shipping: 'Toimitustapa',
    address: 'Osoite',
    pickup: 'Noutopiste',
    payment: 'Maksutapa',
    discount: 'Alennuskoodi',
    total: 'Lomakkeella näkyvä yhteensä',
    message: 'Lisätiedot',
  },
  en: {
    unavailable:
      'The order service is temporarily unavailable. You can try again later or send your order by email.',
    subject: 'Order from Lieromaa',
    unconfirmed: 'The web form submission did not receive confirmation.',
    recipient: 'To',
    subjectLabel: 'Subject',
    draft: 'Order message',
    send: 'Send order by email',
    copy: 'Copy order text',
    copied: 'Order text copied.',
    copyFailed: 'Copying failed. You can select and copy the text above.',
    products: 'Products',
    extras: 'Extras',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    shipping: 'Delivery method',
    address: 'Address',
    pickup: 'Pickup point',
    payment: 'Payment method',
    discount: 'Discount code',
    total: 'Total shown on the form',
    message: 'Additional information',
  },
};
