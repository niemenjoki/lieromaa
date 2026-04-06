import {
  STARTER_KIT_HANDLING_TIME,
  WORMS_HANDLING_TIME,
} from '../commerce/shippingSchedule.mjs';

export const sharedPickupHelperTexts = [
  'Paketti toimitetaan valitsemaasi Postin noutopisteeseen. Huomaa, että Posti voi ohjata lähetyksen toiseen noutopisteeseen, jos esimerkiksi valitsemasi noutopaikka on täynnä.',
];

export const sharedHomeDeliveryHelperTexts = [
  'Posti sopii jakeluajan kanssasi OmaPosti-sovelluksen kautta, tekstiviestillä tai sähköpostitse.',
];

export const sharedLocalPickupHelperTexts = [
  'Jos valitset toimitustavaksi noudon, olen sinuun yhteydessä, jotta voimme sopia noudosta tarkemmin',
];

const localPickupOption = {
  id: 'nouto',
  label: 'Nouto Järvenpäästä',
  price: 0,
  fulfillmentType: 'local_pickup',
  helperTexts: sharedLocalPickupHelperTexts,
};

export const productCatalogSource = {
  worms: {
    name: 'Kompostimadot',
    variantSkus: ['worms-50', 'worms-100', 'worms-200'],
    shippingSku: 'postage-worms-pickup',
    page: {
      canonicalUrl: '/tuotteet/madot',
      pageName: 'Osta kompostimatoja – Eisenia fetida matokompostointiin',
      title: 'Osta kompostimatoja | Lieromaa',
      description:
        'Tilaa kotimaisia kompostimatoja (Eisenia fetida) helposti postitettuna koko Suomeen. Aloita oma matokomposti Lieromaan madoilla!',
      pageDescription:
        'Tilaa kotimaisia kompostimatoja (Eisenia fetida) postitse tai nouda Järvenpäästä. Lieromaa kasvattaa ja myy kompostimatoja vastuullisesti pienimuotoisena yritystoimintana.',
      h1: 'Osta Lieromaan Eisenia fetida -kompostimatoja',
      navigationLabel: 'Kompostimadot',
      updatedAt: '2026-04-05',
    },
    search: {
      contexts: ['blog', 'notFound'],
      title: 'Osta kompostimatoja',
      keywords: ['kompostimadot', 'ostos', 'lieromaa', 'madot', 'myynti'],
    },
    product: {
      name: 'Kompostimadot (Eisenia fetida)',
      description:
        'Kotimaiset kompostimadot (Eisenia fetida) matokompostointiin. Myynnissä 50, 100 ja 200 madon pakkauksina. Sopivat sisä- ja ulkokäyttöön, hajuttomaan biojätteen käsittelyyn ja luonnonmukaiseen lannoitukseen.',
      sku: 'MADOT',
    },
    media: {
      images: [
        {
          url: '/images/wormspage/kompostimadot_kammenella.avif',
          alt: 'Kompostimatoja ja matokompostin sisältöä kämmenellä',
          width: 1536,
          height: 1024,
        },
        {
          url: '/images/wormspage/madot_toimituspakkauksessa.avif',
          alt: 'Kompostimadot toimituspakkauksessa',
        },
      ],
    },
    merchant: {
      title(amount) {
        return `Kompostimadot (${amount} kpl) | Eisenia fetida`;
      },
      description(amount) {
        return `Kotimaiset kompostimadot (${amount} kpl) matokompostointiin. Eisenia fetida -madot toimitetaan omassa kasvualustassaan, ja ne sopivat biojätteen hajuttomaan käsittelyyn sisällä tai ulkona.`;
      },
      productType: 'Matokompostointi > Kompostimadot',
    },
    schema: {
      handlingTime: WORMS_HANDLING_TIME,
      productAttributes: {
        category: 'GardenProduct',
        material: 'Kompostimulta, pahvisilppu, puukuitu, kookoskuitu',
      },
      offerAttributes: {
        priceValidUntil: '2026-06-30',
        seller: {
          '@type': 'Organization',
          name: 'Lieromaa / Joonas Niemenjoki',
          identifier: 'Y-tunnus 3002257-7',
        },
      },
      returnPolicyText:
        'Kompostimadot eivät kuulu 14 vrk peruuttamisoikeuden piiriin (Kuluttajansuojalaki 6 luku 16 §).',
    },
    order: {
      defaultVariantAmount: 100,
      variantLegend: 'Valitse matojen määrä',
      variantSelectorPosition: 'beforeFulfillment',
      variantDescriptionPrefix: 'Voi laskea taloudellesi sopivan matojen määrän',
      variantDescriptionLinkHref: '/matolaskuri',
      variantDescriptionLinkLabel: 'matolaskurilla',
      showWormAmountFinePrint: true,
      getVariantLabel({ amount, priceFormatted }) {
        return `${amount} matoa - ${priceFormatted} €`;
      },
      shippingOptions: [
        {
          id: 'posti_noutopiste',
          label: 'Nouto Postista tai automaatista',
          priceSku: 'postage-worms-pickup',
          fulfillmentType: 'pickup_point',
          helperTexts: sharedPickupHelperTexts,
        },
        localPickupOption,
      ],
      shippingHelperTexts: sharedPickupHelperTexts,
      shippingDescription: null,
      submitButtonLabel() {
        return 'Lähetä tilaus';
      },
      extraInfoDescription: null,
      summaryDescription: null,
      invoiceTimingByFulfillmentType: {
        pickup_point: 'Lasku lähetetään, kun tilaus on toimitettu Postin kuljetettavaksi',
        local_pickup: 'Lasku lähetetään, kun olet noutanut tilauksen',
      },
      extraCharges: [
        {
          key: 'frostProtection',
          fieldName: 'pakkastoimituslisa',
          checkedValue: 'maksan',
          label: 'Pakkastoimituslisä',
          checkboxLabel: 'Maksan pakkastoimituslisän',
          price: 3,
          activeMonths: [9, 10, 11, 12, 1, 2, 3, 4, 5],
          descriptionLines: [
            'Kun ulkolämpötila on alle -5 C, matojen toimittaminen vaatii ylimääräistä pakkausmateriaalia matojen pitämiseksi elossa. Pakkastilanne määritetään alimmasta lämpötilaennusteesta matojen lähtöpaikan (Järvenpää) ja toimitusosoitteen perusteella.',
          ],
          helperTextLines: [
            'Voit tehdä tilauksen myös ilman pakkaslisää, vaikka ulkona olisi pakkasta, jolloin paketti toimitetaan pikimmiten sään lämmettyä.',
          ],
        },
      ],
    },
  },
  starterKit: {
    name: 'Matokompostorin aloituspakkaus',
    variantSkus: ['starterkit-50', 'starterkit-100', 'starterkit-200'],
    shippingSku: 'postage-starterkit-pickup',
    page: {
      canonicalUrl: '/tuotteet/matokompostin-aloituspakkaus',
      pageName: 'Matokompostorin aloituspakkaus ja madot',
      title: 'Matokompostorin aloituspakkaus (sis. madot) | Lieromaa',
      description:
        'Lieromaan aloituspakkaus tekee matokompostin ylläpidosta sujuvaa: kolmen laatikon kompostori, petimateriaali ja kompostimadot samassa paketissa.',
      h1: 'Lieromaan matokompostorin aloituspakkaus',
      navigationLabel: 'Aloituspakkaus',
      updatedAt: '2026-04-05',
    },
    search: {
      contexts: ['blog', 'notFound'],
      title: 'Matokompostorin aloituspakkaus',
      keywords: ['aloituspakkaus', 'matokompostori', 'kompostori', 'kompostimadot'],
    },
    product: {
      name: 'Matokompostorin aloituspakkaus',
      description:
        'Lieromaan aloituspakkaus on suunniteltu sujuvaan matokompostin ylläpitoon: kolmen laatikon kompostori, petimateriaali ja kompostimadot samassa paketissa.',
      sku: 'LM-STARTER-001',
    },
    media: {
      images: [
        {
          url: '/images/starterkit/aloituspakkaus_suljettu_matokompostori.avif',
          alt: 'Suljettu musta matokompostori oransseilla kahvoilla vaaleaa taustaa vasten.',
          width: 1200,
          height: 800,
          priority: true,
          loading: 'eager',
        },
        {
          url: '/images/starterkit/aloituspakkaus_sisalto_ylhaalta_kuvattuna.avif',
          alt: 'Matokompostin aloituspakkauksen sisältö ylhäältä kuvattuna: kolme mustaa laatikkoa, kookoskuituharkot ja erillinen astia kuivikkeelle.',
        },
        {
          url: '/images/starterkit/aloituspakkaus_kompostimadot_toimitusastiassa.avif',
          alt: 'Kompostimadot toimitusastiassa omassa kasvualustassaan valmiina siirrettäväksi kompostoriin.',
        },
        {
          url: '/images/starterkit/aloituspakkaus_kompostimadot_lahella.avif',
          alt: 'Lähikuva elävistä kompostimadoista kosteassa ja ilmavassa kasvualustassa.',
        },
      ],
    },
    faqItems: [
      {
        question: 'Haiseeko matokompostori?',
        answer:
          'Oikein hoidettuna matokompostori on hajuton. Hajuhaitat liittyvät yleensä liialliseen ruokintaan tai liian kosteaan massaan.',
      },
      {
        question: 'Kuinka nopeasti kompostointi käynnistyy?',
        answer:
          'Madot alkavat käsitellä biojätettä heti, mutta ensimmäisten viikkojen aikana ruokintaa suositellaan maltillisena.',
      },
      {
        question: 'Voiko kompostoria pitää sisätiloissa?',
        answer:
          'Kyllä. Läpivirtauskompostori soveltuu hyvin sisäkäyttöön, kun kosteustasapaino ja ruokinta pidetään hallinnassa.',
      },
    ],
    merchant: {
      title(amount) {
        return `Matokompostorin aloituspakkaus + ${amount} kompostimatoa`;
      },
      description(amount) {
        return `Lieromaan aloituspakkaus sisältää kolmen laatikon läpivirtauskompostorin, petimateriaalin ja ${amount} kompostimatoa. Paketti on suunniteltu sujuvaan matokompostin ylläpitoon kotona.`;
      },
      productType: 'Matokompostointi > Matokompostorit > Aloituspakkaukset',
    },
    schema: {
      handlingTime: STARTER_KIT_HANDLING_TIME,
      returnPolicyText:
        'Aloituspakkauksella on 14 vrk peruuttamisoikeus itse pakkauksen osalta. Pakettiin sisältyvien kompostimatojen osuutta ei hyvitetä, jos lähetys on ehditty toimittaa.',
    },
    order: {
      defaultVariantAmount: 100,
      variantLegend: 'Valitse matojen määrä',
      variantSelectorPosition: 'beforeFulfillment',
      variantDescriptionPrefix: 'Voi laskea taloudellesi sopivan matojen määrän',
      variantDescriptionLinkHref: '/matolaskuri',
      variantDescriptionLinkLabel: 'matolaskurilla',
      showWormAmountFinePrint: true,
      getVariantLabel({ amount, priceFormatted }) {
        return `Aloituspakkaus + ${amount} matoa - ${priceFormatted} €`;
      },
      shippingOptions: [
        {
          id: 'posti_noutopiste',
          label: 'Nouto Postista tai automaatista',
          priceSku: 'postage-starterkit-pickup',
          fulfillmentType: 'pickup_point',
          helperTexts: sharedPickupHelperTexts,
        },
        {
          id: 'posti_kotiinkuljetus',
          label: 'Postin kotiinkuljetus sovittuna aikana',
          priceSku: 'postage-starterkit-home',
          fulfillmentType: 'home_delivery',
          helperTexts: sharedHomeDeliveryHelperTexts,
        },
        localPickupOption,
      ],
      shippingHelperTexts: sharedPickupHelperTexts,
      shippingDescription: null,
      submitButtonLabel({ totalFormatted }) {
        return `Lähetä tilaus (${totalFormatted} €)`;
      },
      extraInfoDescription: null,
      summaryDescription: null,
      invoiceTimingByFulfillmentType: {
        pickup_point: 'Lasku lähetetään, kun tilaus on toimitettu Postin kuljetettavaksi',
        home_delivery:
          'Lasku lähetetään, kun tilaus on toimitettu Postin kuljetettavaksi',
        local_pickup: 'Lasku lähetetään, kun olet noutanut tilauksen',
      },
    },
  },
};
