export const commonMessages = Object.freeze({
  site: Object.freeze({
    description:
      'Lieromaa kokoaa käytännön oppaat, kokemukset ja työkalut matokompostoinnin aloittamiseen, hoitoon ja matokakan hyödyntämiseen.',
    contactType: 'Customer Support',
    founderJobTitle: 'Founder',
  }),
  navbar: Object.freeze({
    logoAlt: 'Lieromaa logo',
    searchLabel: 'Hae sivustolta',
    followHeading: 'Seuraa',
    languageSwitchLabel: 'In English',
    languageSwitchLanguage: 'en',
  }),
  cart: Object.freeze({
    emptyLabel: 'Ostoskori',
    oneItemLabel: 'Ostoskori, 1 tuote',
    itemLabel: 'Ostoskori, {count} tuotetta',
  }),
  theme: Object.freeze({
    useLight: 'Käytä vaaleaa teemaa',
    useDark: 'Käytä tummaa teemaa',
  }),
  navigation: Object.freeze({
    openMenu: 'Avaa valikko',
    closeMenu: 'Sulje valikko',
  }),
  footer: Object.freeze({
    followHeading: 'Seuraa',
    businessIdLabel: 'Y-tunnus',
    consentSettings: 'Muuta evästeasetuksia',
    consentFailure:
      'Evästeasetuksia ei voitu avata juuri nyt. Yritä ladata sivu uudelleen.',
    licence: 'Lisenssi',
    sourceCode: 'Lähdekoodi',
  }),
  finnishContentNotice: Object.freeze({
    message: 'You are now viewing content that is available only in Finnish.',
    backLabel: 'Back to the English shop',
    dismissLabel: 'Dismiss',
  }),
  notFound: Object.freeze({
    metadataTitle: 'Sivua ei löytynyt | Lieromaa',
    metadataDescription: 'Hakemaasi sivua ei löytynyt. Hae sivustolta tai selaa oppaita.',
    eyebrow: 'Hups!',
    title: 'Näyttää siltä, että etsimääsi sivua ei ole olemassa',
    search: 'Hae sivustolta',
    guides: 'Siirry oppaisiin',
  }),
  publicMessages: Object.freeze({
    invalidRequest: 'Pyyntöä ei voitu käsitellä. Tarkista tiedot ja yritä uudelleen.',
    sameOriginRequired: 'Pyyntöä ei voitu vahvistaa. Lataa sivu uudelleen.',
    upstreamUnavailable:
      'Palvelu ei ole juuri nyt käytettävissä. Yritä myöhemmin uudelleen.',
    unknownError: 'Jotain meni vikaan. Yritä uudelleen.',
  }),
});

export default commonMessages;
