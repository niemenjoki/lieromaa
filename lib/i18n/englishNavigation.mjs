import { CONTACT_EMAIL } from '../site/contact.js';
import { getRoutePath } from './routes.mjs';

const finnishOnlyLinks = Object.freeze([
  Object.freeze({
    href: '/opas?from=en',
    label: 'Worm-composting guides',
    badge: 'In Finnish',
    lang: 'fi',
  }),
  Object.freeze({
    href: '/blogi?from=en',
    label: 'Blog',
    badge: 'In Finnish',
    lang: 'fi',
  }),
]);

export function getEnglishNavigation() {
  const primaryLinks = [
    {
      kind: 'link',
      href: getRoutePath('products', 'en'),
      label: 'Products',
    },
    {
      kind: 'link',
      href: getRoutePath('wormCalculator', 'en'),
      label: 'Worm calculator',
    },
    {
      kind: 'link',
      href: getRoutePath('about', 'en'),
      label: 'About',
    },
  ];

  return {
    primaryItems: [
      {
        id: 'home',
        href: getRoutePath('home', 'en'),
        label: 'Home',
        icon: 'home',
        exactPaths: [getRoutePath('home', 'en')],
      },
      {
        id: 'worms',
        href: getRoutePath('compostWorms', 'en'),
        label: 'Worms',
        icon: 'worms',
        matchPrefixes: ['/en/products', '/en/checkout'],
      },
      {
        id: 'calculator',
        href: getRoutePath('wormCalculator', 'en'),
        label: 'Calculator',
        icon: 'calculator',
        exactPaths: [getRoutePath('wormCalculator', 'en')],
      },
      {
        id: 'about',
        href: getRoutePath('about', 'en'),
        label: 'About',
        icon: 'about',
        matchPrefixes: ['/en/about'],
      },
    ],
    mobileDockIds: ['home', 'worms', 'calculator', 'about'],
    desktopPrimaryIds: ['worms', 'calculator', 'about'],
    guideCategories: [],
    secondarySections: [
      {
        heading: 'Customer service',
        items: [
          {
            href: getRoutePath('gettingStarted', 'en'),
            label: 'Getting started with compost worms',
          },
          {
            href: getRoutePath('orderTerms', 'en'),
            label: 'Order and delivery terms',
          },
          { href: getRoutePath('cancelOrder', 'en'), label: 'Cancel order' },
          { href: getRoutePath('dataRequest', 'en'), label: 'Download your data' },
          { href: getRoutePath('privacy', 'en'), label: 'Privacy notice' },
        ],
      },
      {
        heading: 'More in Finnish',
        items: finnishOnlyLinks,
      },
    ],
    settingsSection: {
      heading: 'Language and settings',
      languageLink: {
        href: '/',
        label: 'Suomeksi',
        lang: 'fi',
      },
    },
    desktopItems: [
      ...primaryLinks,
      { kind: 'menu', label: 'More in Finnish', items: finnishOnlyLinks },
    ],
    footerColumns: [
      {
        heading: 'Shop',
        items: [
          { href: getRoutePath('products', 'en'), label: 'Products' },
          { href: getRoutePath('compostWorms', 'en'), label: 'Compost worms' },
          {
            href: getRoutePath('compostFibreMix', 'en'),
            label: 'Compost fibre mix',
          },
          { href: getRoutePath('wormCalculator', 'en'), label: 'Worm calculator' },
        ],
      },
      {
        heading: 'Customer service',
        items: [
          {
            href: getRoutePath('gettingStarted', 'en'),
            label: 'Getting started with compost worms',
          },
          {
            href: getRoutePath('orderTerms', 'en'),
            label: 'Order and delivery terms',
          },
          { href: getRoutePath('cancelOrder', 'en'), label: 'Cancel order' },
          { href: getRoutePath('privacy', 'en'), label: 'Privacy notice' },
          { href: getRoutePath('dataRequest', 'en'), label: 'Download your data' },
        ],
      },
      {
        heading: 'About',
        items: [
          { href: getRoutePath('about', 'en'), label: 'About Lieromaa' },
          {
            href: getRoutePath('wormSource', 'en'),
            label: 'Where Lieromaa’s worms come from',
          },
          { href: `mailto:${CONTACT_EMAIL}`, label: 'Email Lieromaa', external: true },
        ],
      },
      {
        heading: 'More in Finnish',
        items: finnishOnlyLinks,
      },
    ],
    mobileSections: [
      { heading: 'English pages', items: primaryLinks },
      { heading: 'More in Finnish', items: finnishOnlyLinks },
    ],
  };
}

export { finnishOnlyLinks };
