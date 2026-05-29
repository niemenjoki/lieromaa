export const productCatalogContentSource = {
  worms: {
    name: 'Kompostimadot',
    page: {
      canonicalUrl: '/tuotteet/madot',
      pageName: 'Osta kompostimatoja – Eisenia fetida matokompostointiin',
      title: 'Osta kompostimatoja | Lieromaa',
      description:
        'Tilaa kotimaisia kompostimatoja (Eisenia fetida) postitettuna koko Suomeen. Aloita matokomposti Lieromaan madoilla!',
      pageDescription:
        'Tilaa kotimaisia kompostimatoja (Eisenia fetida) postitse tai nouda Järvenpäästä. Lieromaa kasvattaa ja myy kompostimatoja vastuullisesti pienimuotoisena yritystoimintana.',
      h1: 'Osta Lieromaan Eisenia fetida -kompostimatoja',
      navigationLabel: 'Kompostimadot',
      updatedAt: '2026-05-16',
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

        return `Kotimaiset kompostimadot (${weight} g${estimate}) matokompostointiin. Eisenia fetida -madot toimitetaan noin 0,5 litrassa kasvualustaa, joka suojaa niitä kuljetuksessa ja tuo uuteen kompostoriin mikrobeja. Tilauksen jälkeen madot siirretään kasvualustoineen kompostorin omaan petimateriaaliin. Todellinen matojen määrä vaihtelee yksilöiden koon mukaan.`;
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
        'Postitettuja matotilauksia ei voi peruuttaa, koska kompostimatoja ei voida palautuksen jälkeen käsitellä tai myydä edelleen tavanomaisena tuotteena. Jos tuotteessa tai toimituksessa on virhe, asia käsitellään erikseen asiakaspalvelun kautta.',
    },
  },
  starterKit: {
    name: 'Matokompostorin aloituspakkaus',
    page: {
      canonicalUrl: '/tuotteet/matokompostin-aloituspakkaus',
      pageName: 'Matokompostorin aloituspakkaus',
      title: 'Matokompostorin aloituspakkaus | Lieromaa',
      description:
        'Lieromaan aloituspakkaus tekee matokompostoinnin aloittamisesta helppoa: valitse 1, 2 tai 3 laatikkoa ja laajenna myöhemmin tarvittaessa.',
      h1: 'Lieromaan matokompostorin aloituspakkaus',
      navigationLabel: 'Aloituspakkaus',
      updatedAt: '2026-05-22',
    },
    search: {
      contexts: ['blog', 'notFound'],
      title: 'Matokompostorin aloituspakkaus',
      keywords: ['aloituspakkaus', 'matokompostori', 'kompostori', 'kompostimadot'],
    },
    product: {
      name: 'Matokompostorin aloituspakkaus',
      description:
        'Lieromaan aloituspakkaus on modulaarinen matokompostori kotikäyttöön: valitse 1, 2 tai 3 laatikkoa ja laajenna samaa järjestelmää myöhemmin.',
      sku: 'starterkit',
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
          alt: 'Matokompostin aloituspakkauksen sisältö ylhäältä kuvattuna: kolme mustaa laatikkoa, kookoskuituharkot ja erillinen astia petimateriaalille.',
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
          'Madot alkavat käsitellä biojätettä heti, mutta ensimmäisten viikkojen aikana ruokinta kannattaa pitää maltillisena.',
      },
      {
        question: 'Voiko kompostoria pitää sisätiloissa?',
        answer:
          'Kyllä. Lieromaan laatikkomalli soveltuu hyvin sisäkäyttöön, kun kosteustasapaino ja ruokinta pidetään hallinnassa.',
      },
    ],
    merchant: {
      title(amount, variant) {
        const boxCount = variant?.binCount ?? amount;
        const boxLabel = boxCount === 1 ? '1 laatikko' : `${boxCount} laatikkoa`;
        return `Matokompostorin aloituspakkaus (${boxLabel})`;
      },
      description(amount, variant) {
        const boxCount = variant?.binCount ?? amount;
        const boxLabel = boxCount === 1 ? 'yhden laatikon' : `${boxCount} laatikon`;
        return `Lieromaan ${boxLabel} aloituspakkaus sisältää valmiiksi valmistellut laatikot, kannen ja kookoskuitua uuden matokompostorin käynnistämiseen. Kompostimadot ja kuituseoksen voi lisätä tilaukseen erikseen.`;
      },
      productType: 'Matokompostointi > Matokompostorit > Aloituspakkaukset',
    },
    schema: {
      returnPolicyText:
        'Aloituspakkauksella on 14 päivän peruuttamisoikeus käyttämättömälle tuotteelle. Postitettuja matotilauksia ei voi peruuttaa, mutta muilla tuotteilla on normaali peruuttamisoikeus, vaikka ne olisi tilattu samassa tilauksessa matojen kanssa.',
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
      updatedAt: '2026-05-10',
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
      sku: 'chow-150',
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
        'Avaamattomalla ja käyttämättömällä kuituseoksella on 14 vrk peruuttamisoikeus tilaus- ja toimitusehtojen mukaisesti. Jos tuotteessa tai toimituksessa on virhe, asia käsitellään erikseen asiakaspalvelun kautta.',
    },
  },
};

export default productCatalogContentSource;
