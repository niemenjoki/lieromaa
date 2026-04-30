export const productCatalogContentSource = {
  worms: {
    name: 'Kompostimadot',
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
      updatedAt: '2026-04-28',
    },
    search: {
      contexts: ['blog', 'notFound'],
      title: 'Osta kompostimatoja',
      keywords: ['kompostimadot', 'ostos', 'lieromaa', 'madot', 'myynti'],
    },
    product: {
      name: 'Kompostimadot (Eisenia fetida)',
      description:
        'Kotimaiset kompostimadot (Eisenia fetida) matokompostointiin. Myynnissä 25 g, 50 g, 75 g ja 100 g pakkauksina. Pakkausten arvioidut matomäärät ovat noin 50, 100, 150 ja 200 matoa, mutta todellinen määrä vaihtelee matojen koon mukaan.',
      sku: 'MADOT',
    },
    media: {
      images: [
        {
          url: '/images/products/worms-hero.avif',
          alt: 'Kompostimatoja ja matokompostin sisältöä kämmenellä',
          width: 1200,
          height: 900,
        },
        {
          url: '/images/products/worms-packaging.avif',
          alt: 'Kompostimadot toimituspakkauksessa',
          width: 1200,
          height: 900,
        },
      ],
    },
    merchant: {
      title(amount, variant) {
        const weight = variant?.weightGrams ?? amount;
        const estimate = variant?.estimatedWormCount
          ? `, noin ${variant.estimatedWormCount} matoa`
          : '';

        return `Kompostimadot (${weight} g${estimate}) | Eisenia fetida`;
      },
      description(amount, variant) {
        const weight = variant?.weightGrams ?? amount;
        const estimate = variant?.estimatedWormCount
          ? `, arviolta noin ${variant.estimatedWormCount} matoa`
          : '';

        return `Kotimaiset kompostimadot (${weight} g${estimate}) matokompostointiin. Eisenia fetida -madot toimitetaan omassa kasvualustassaan, ja ne sopivat biojätteen hajuttomaan käsittelyyn sisällä tai ulkona. Todellinen matojen määrä vaihtelee yksilöiden koon mukaan.`;
      },
      productType: 'Matokompostointi > Kompostimadot',
    },
    schema: {
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
  },
  starterKit: {
    name: 'Matokompostorin aloituspakkaus',
    page: {
      canonicalUrl: '/tuotteet/matokompostin-aloituspakkaus',
      pageName: 'Matokompostorin aloituspakkaus',
      title: 'Matokompostorin aloituspakkaus | Lieromaa',
      description:
        'Lieromaan aloituspakkaus tekee matokompostin ylläpidosta sujuvaa: kolmen laatikon pinottu kompostori ja petimateriaali samassa paketissa.',
      h1: 'Lieromaan matokompostorin aloituspakkaus',
      navigationLabel: 'Aloituspakkaus',
      updatedAt: '2026-04-28',
    },
    search: {
      contexts: ['blog', 'notFound'],
      title: 'Matokompostorin aloituspakkaus',
      keywords: ['aloituspakkaus', 'matokompostori', 'kompostori', 'kompostimadot'],
    },
    product: {
      name: 'Matokompostorin aloituspakkaus',
      description:
        'Lieromaan aloituspakkaus on suunniteltu sujuvaan matokompostin ylläpitoon: kolmen laatikon pinottu kompostori ja petimateriaali samassa paketissa.',
      sku: 'starterkit-base',
    },
    media: {
      images: [
        {
          url: '/images/products/starterkit-hero.avif',
          alt: 'Suljettu musta matokompostori oransseilla kahvoilla vaaleaa taustaa vasten.',
          width: 1200,
          height: 900,
          priority: true,
          loading: 'eager',
        },
        {
          url: '/images/products/starterkit-contents.avif',
          alt: 'Matokompostin aloituspakkauksen sisältö ylhäältä kuvattuna: kolme mustaa laatikkoa, kookoskuituharkot ja erillinen astia kuivikkeelle.',
          width: 1200,
          height: 900,
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
          'Kyllä. Kolmen laatikon pinottu matokompostori soveltuu hyvin sisäkäyttöön, kun kosteustasapaino ja ruokinta pidetään hallinnassa.',
      },
    ],
    merchant: {
      title(amount, variant) {
        return 'Matokompostorin aloituspakkaus ilman matoja';
      },
      description(amount, variant) {
        return 'Lieromaan aloituspakkaus sisältää kolmen laatikon pinotun matokompostorin ja petimateriaalin. Kuituseoksen voi lisätä tilaukseen erikseen.';
      },
      productType: 'Matokompostointi > Matokompostorit > Aloituspakkaukset',
    },
    schema: {
      returnPolicyText:
        'Aloituspakkauksella on 14 vrk peruuttamisoikeus käyttämättömän tuotteen osalta. Elävien kompostimatojen peruuttamisoikeus arvioidaan erikseen, jos tilaukseen lisätään matoja.',
    },
  },
  compostChow: {
    name: 'Lieromaan kompostorin kuituseos',
    page: {
      canonicalUrl: '/tuotteet/kompostorin-kuituseos',
      pageName: 'Lieromaan kompostorin kuituseos',
      title: 'Kompostorin kuituseos | Lieromaa',
      description:
        'Lieromaan kompostorin kuituseos on helppokäyttöinen lisäseos kompostiin. Se helpottaa kompostin ylläpitoa erityisesti silloin, kun biojätteen määrä vaihtelee.',
      h1: 'Lieromaan kompostorin kuituseos',
      navigationLabel: 'Kuituseos',
      updatedAt: '2026-04-30',
    },
    search: {
      contexts: ['blog', 'notFound'],
      title: 'Kompostorin kuituseos',
      keywords: ['kuituseos', 'matokomposti', 'komposti', 'biojäte'],
    },
    product: {
      name: 'Lieromaan kompostorin kuituseos',
      description:
        'Helppokäyttöinen lisäseos kompostiin. Helpottaa kompostin ylläpitoa erityisesti silloin, kun biojätteen määrä vaihtelee',
      sku: 'chow-400',
    },
    media: {
      images: [
        {
          url: '/images/products/chow-hero.avif',
          alt: 'Lieromaan kompostorin kuituseoksen pakkaus vaaleaa taustaa vasten',
          width: 1200,
          height: 900,
          priority: true,
          loading: 'eager',
        },
        {
          url: '/images/products/chow-usage.avif',
          alt: 'Kuituseoksen lisääminen lusikalla matokompostoriin',
          width: 1200,
          height: 900,
        },
        {
          url: '/images/products/chow-scale.avif',
          alt: 'Lieromaan kompostorin kuituseos ja annostelulusikka',
          width: 1200,
          height: 900,
        },
      ],
    },
    merchant: {
      title(amount, variant) {
        const weight = variant?.weightGrams ?? amount;
        return `Lieromaan kompostorin kuituseos (${weight} g)`;
      },
      description(amount, variant) {
        const weight = variant?.weightGrams ?? amount;
        return `Lieromaan kompostorin kuituseos (${weight} g) on helppokäyttöinen lisäseos kompostiin. Se helpottaa kompostin ylläpitoa erityisesti silloin, kun biojätteen määrä vaihtelee.`;
      },
      productType: 'Matokompostointi > Matokompostin hoito > Kuituseokset',
    },
    schema: {
      productAttributes: {
        category: 'GardenProduct',
        material:
          'Vehnälese, kauralese, soijarouhe, vehnäjauho, puutarhakalkki, zeoliitti, basaltti',
      },
      returnPolicyText:
        'Avaamattomalla ja käyttämättömällä kuituseoksella on 14 vrk peruuttamisoikeus tilaus- ja toimitusehtojen mukaisesti.',
    },
  },
};

export default productCatalogContentSource;
