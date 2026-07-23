export const productCatalogContentSource = {
  worms: {
    name: 'Kompostimadot',
    page: {
      canonicalUrl: '/tuotteet/madot',
      pageName: 'Osta kompostimatoja – Eisenia fetida matokompostointiin',
      title: 'Osta kompostimatoja | Lieromaa',
      description:
        'Tilaa kotimaisia kompostimatoja koko Suomeen. Valitse pelkät madot tai madot käyttövalmiissa 14 litran matokompostorissa.',
      pageDescription:
        'Tilaa kotimaisia kompostimatoja (Eisenia fetida) postitse tai nouda Järvenpäästä. Voit valita pelkät madot tai käyttövalmiin 14 litran matokompostorin, jossa madot ovat jo asettuneet petimateriaaliin.',
      h1: 'Osta Lieromaan Eisenia fetida -kompostimatoja',
      navigationLabel: 'Kompostimadot',
      updatedAt: '2026-07-14',
    },
    search: {
      contexts: ['blog', 'notFound'],
      title: 'Osta kompostimatoja',
      keywords: [
        'kompostimadot',
        'ostos',
        'lieromaa',
        'madot',
        'myynti',
        'käyttövalmis matokompostori',
        '14 litran matokompostori',
      ],
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
  compostChow: {
    name: 'Lieromaan matokompostorin kuituseos',
    page: {
      canonicalUrl: '/tuotteet/kompostorin-kuituseos',
      pageName: 'Lieromaan matokompostorin kuituseos',
      title: 'Matokompostorin kuituseos | Lieromaa',
      description:
        'Lieromaan kompostorin kuituseos on helppokäyttöinen lisäseos kompostiin. Se helpottaa kompostin ylläpitoa erityisesti silloin, kun biojätteen määrä vaihtelee.',
      h1: 'Lieromaan matokompostorin kuituseos',
      navigationLabel: 'Kuituseos',
      updatedAt: '2026-06-03',
    },
    search: {
      contexts: ['blog', 'notFound'],
      title: 'Matokompostorin kuituseos',
      keywords: ['kuituseos', 'matokomposti', 'komposti', 'biojäte'],
    },
    product: {
      name: 'Lieromaan matokompostorin kuituseos',
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
        return `Lieromaan matokompostorin kuituseos (${weight} g)`;
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
