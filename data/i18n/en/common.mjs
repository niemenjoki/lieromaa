export const commonMessages = Object.freeze({
  site: Object.freeze({
    description:
      'Lieromaa supplies compost worms and practical support for worm composting in Finland.',
    contactType: 'Customer Support',
    founderJobTitle: 'Founder',
  }),
  navbar: Object.freeze({
    logoAlt: 'Lieromaa logo',
    searchLabel: 'Search the site',
    followHeading: 'Follow',
    languageSwitchLabel: 'Suomeksi',
    languageSwitchLanguage: 'fi',
  }),
  cart: Object.freeze({
    emptyLabel: 'Shopping cart',
    oneItemLabel: 'Shopping cart, 1 item',
    itemLabel: 'Shopping cart, {count} items',
  }),
  theme: Object.freeze({
    toggle: 'Toggle color theme',
    useLight: 'Use light theme',
    useDark: 'Use dark theme',
  }),
  navigation: Object.freeze({
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  }),
  footer: Object.freeze({
    followHeading: 'Follow',
    businessIdLabel: 'Business ID',
    consentSettings: 'Change cookie settings',
    consentFailure:
      'Cookie settings could not be opened right now. Please reload the page and try again.',
    licence: 'Licence',
    sourceCode: 'Source code',
  }),
  finnishContentNotice: Object.freeze({
    message: 'You are now viewing content that is available only in Finnish.',
    backLabel: 'Back to the English shop',
    dismissLabel: 'Dismiss',
  }),
  notFound: Object.freeze({
    metadataTitle: 'Page not found | Lieromaa',
    metadataDescription: 'The page you were looking for could not be found.',
    eyebrow: 'Oops!',
    title: 'The page you were looking for does not exist',
    search: 'Go to the English shop',
    guides: 'View compost worms',
  }),
  publicMessages: Object.freeze({
    invalidRequest:
      'The request could not be processed. Check the details and try again.',
    sameOriginRequired:
      'The request could not be verified. Reload the page and try again.',
    upstreamUnavailable:
      'The service is not available right now. Please try again later.',
    unknownError: 'Something went wrong. Please try again.',
  }),
});

export default commonMessages;
