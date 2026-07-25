export const ENGLISH_PROJECT_PUBLISHED_AT = '2026-07-17';

export const englishPageDefinitions = Object.freeze(
  [
    {
      canonicalUrl: '/en',
      title: 'Compost worms and worm-composting supplies in Finland | Lieromaa',
      description:
        'Shop locally raised compost worms with optional add-ons and a separately orderable 500 g compost fibre mix from Lieromaa.',
      updatedAt: '2026-07-25',
    },
    {
      canonicalUrl: '/en/products/compost-worms',
      title: 'Buy compost worms in Finland | Lieromaa',
      description:
        'Order locally raised compost worms in Finland and optionally add a ready-to-use 14-litre worm bin or a small fibre-mix pack.',
      updatedAt: '2026-07-25',
    },
    {
      canonicalUrl: '/en/products/compost-fibre-mix',
      title: 'Compost fibre mix | Lieromaa',
      description:
        'Lieromaa compost fibre mix is an easy-to-use supplement for balancing a worm bin when the amount of food waste varies.',
      updatedAt: '2026-07-25',
    },
    {
      canonicalUrl: '/en/worm-calculator',
      title: 'Worm calculator | Lieromaa',
      description:
        'Estimate a suitable starting weight of compost worms from your household size and diet with Lieromaa’s English worm calculator.',
    },
    {
      canonicalUrl: '/en/getting-started-with-compost-worms',
      title: 'Getting started with compost worms | Lieromaa',
      description:
        'Settle compost worms into their worm bin, feed them cautiously and recognise moisture, smell, temperature and escape problems during the first month.',
    },
    {
      canonicalUrl: '/en/about/where-our-worms-come-from',
      title: 'Where do Lieromaa’s compost worms come from?',
      description:
        'See how Lieromaa raises compost worms in a heated home garage in Järvenpää and collects each customer order from active worm bins.',
    },
    {
      canonicalUrl: '/en/about',
      title: 'About Lieromaa and its founder | Lieromaa',
      description:
        'Meet Lieromaa founder Joonas Niemenjoki and learn how practical experience with home worm composting grew into a small Finnish business.',
    },
    {
      canonicalUrl: '/en/order-and-delivery-terms',
      title: 'Order and delivery terms | Lieromaa',
      description:
        'Read Lieromaa’s English terms for ordering, invoicing, delivery, cancellation, defects and dispute resolution in Finland.',
    },
    {
      canonicalUrl: '/en/privacy',
      title: 'Privacy notice | Lieromaa',
      description:
        'Read how Lieromaa collects, uses, stores and shares personal data for orders, customer service, reviews, analytics, advertising and data requests.',
    },
    {
      canonicalUrl: '/en/data-request',
      title: 'Download your order data | Lieromaa',
      description:
        'Request a secure one-time download link for personal data connected with your Lieromaa order.',
    },
    {
      canonicalUrl: '/en/checkout',
      title: 'Checkout | Lieromaa',
      description:
        'Review your shopping cart, choose delivery within Finland and send your Lieromaa order in English.',
      robots: { index: false, follow: true },
    },
    {
      canonicalUrl: '/en/cancel-order',
      title: 'Cancel an order | Lieromaa',
      description:
        'Send an English cancellation notice for a Lieromaa order and provide the details needed to identify the order.',
      robots: { index: false, follow: true },
    },
    {
      canonicalUrl: '/en/data-request/download',
      title: 'Download your data | Lieromaa',
      description: 'Download the data connected with your Lieromaa order.',
      robots: { index: false, follow: false, nocache: true },
    },
    {
      canonicalUrl: '/en/review',
      title: 'Review your order | Lieromaa',
      description:
        'Leave a star rating, written review and private feedback for a verified Lieromaa order.',
      robots: { index: false, follow: false },
    },
  ].map((page) => Object.freeze({ updatedAt: ENGLISH_PROJECT_PUBLISHED_AT, ...page }))
);

export const englishIndexablePageDefinitions = Object.freeze(
  englishPageDefinitions.filter((page) => page.robots?.index !== false)
);

export const englishFunctionalPagePaths = Object.freeze(
  englishPageDefinitions
    .filter((page) => page.robots?.index === false)
    .map((page) => page.canonicalUrl)
);

export const englishRedirectPaths = Object.freeze(['/en/products']);
