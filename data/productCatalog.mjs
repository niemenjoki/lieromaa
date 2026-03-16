import { SITE_URL } from './vars.mjs';

const merchantDefaults = {
  brand: 'Lieromaa',
  availability: 'in_stock',
  condition: 'new',
  identifierExists: 'no',
  shippingService: 'Posti',
};

const schemaDefaults = {
  brandName: 'Lieromaa',
  shippingDestinationCountry: 'FI',
  handlingTime: {
    minValue: 1,
    maxValue: 2,
    unitCode: 'd',
  },
  transitTime: {
    minValue: 2,
    maxValue: 4,
    unitCode: 'd',
  },
  returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
};

const baseProductCatalog = {
  worms: {
    name: 'Kompostimadot',
    variantSkus: ['worms-50', 'worms-100', 'worms-200'],
    shippingSku: 'postage-worms',
    page: {
      canonicalUrl: '/tuotteet/madot',
      pageName: 'Osta kompostimatoja – Eisenia fetida matokompostointiin',
      title: 'Osta kompostimatoja | Lieromaa',
      description:
        'Tilaa kotimaisia kompostimatoja (Eisenia fetida) helposti postitettuna koko Suomeen. Aloita oma matokomposti Lieromaan madoilla!',
      pageDescription:
        'Tilaa kotimaisia kompostimatoja (Eisenia fetida) postitse tai nouda Järvenpäästä. Lieromaa kasvattaa ja myy kompostimatoja vastuullisesti pienimuotoisena yritystoimintana.',
      h1: 'Osta Lieromaan Eisenia fetida -kompostimatoja',
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
      webPage: {
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
      },
      productAttributes: {
        category: 'GardenProduct',
        material: 'Kompostimulta, pahvisilppu, puukuitu, kookoskuitu',
      },
      brandLogo: `${SITE_URL}/images/lieromaa_logo_1024.avif`,
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
    variantSkus: ['starterkit-50', 'starterkit-100', 'starterkit-200'],
    shippingSku: 'postage-starterkit',
    page: {
      canonicalUrl: '/tuotteet/matokompostin-aloituspakkaus',
      pageName: 'Matokompostorin aloituspakkaus ja madot',
      description:
        'Lieromaan aloituspakkaus tekee aloituksesta helppoa: kolmen laatikon kompostori, petimateriaali ja kompostimadot valmiina käyttöön.',
      h1: 'Lieromaan matokompostorin aloituspakkaus on nyt tilattavissa',
    },
    product: {
      name: 'Matokompostorin aloituspakkaus',
      description:
        'Lieromaan aloituspakkaus tekee aloituksesta helppoa: kolmen laatikon kompostori, petimateriaali ja kompostimadot valmiina käyttöön.',
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
        return `Lieromaan aloituspakkaus sisältää kolmen laatikon läpivirtauskompostorin, petimateriaalin ja ${amount} kompostimatoa. Paketti on suunniteltu helppoon matokompostoinnin aloitukseen kotona.`;
      },
      productType: 'Matokompostointi > Matokompostorit > Aloituspakkaukset',
    },
    schema: {
      returnPolicyText:
        'Aloituspakkaus sisältää kompostimatoja, jotka eivät kuulu 14 vrk peruuttamisoikeuden piiriin (Kuluttajansuojalaki 6 luku 16 §).',
    },
  },
};

function createImageEntries(images) {
  return images.map((image) => ({
    ...image,
    src: image.url,
    absoluteUrl: new URL(image.url, SITE_URL).toString(),
  }));
}

function createCatalogEntry(productKey, product) {
  const canonicalUrl = product.page.canonicalUrl;
  const pageUrl = new URL(canonicalUrl, SITE_URL).toString();
  const images = createImageEntries(product.media.images);
  const primaryImage = images[0];
  const title = product.page.title ?? `${product.page.pageName} | Lieromaa`;
  const description = product.page.description;

  return {
    ...product,
    key: productKey,
    canonicalUrl,
    pageUrl,
    pageId: `${pageUrl}#webpage`,
    faqId: `${pageUrl}#faq`,
    productId: `${pageUrl}#product`,
    pageName: product.page.pageName,
    title,
    description,
    pageDescription: product.page.pageDescription ?? description,
    h1: product.page.h1,
    productName: product.product.name,
    productDescription: product.product.description ?? description,
    image: primaryImage
      ? {
          url: primaryImage.url,
          width: primaryImage.width,
          height: primaryImage.height,
          alt: primaryImage.alt,
        }
      : null,
    imageUrl: primaryImage?.absoluteUrl ?? '',
    images,
    productImageUrls: images.map((image) => image.absoluteUrl),
    faqItems: product.faqItems ?? [],
    metadata: {
      title,
      description,
      canonicalUrl,
      image: primaryImage
        ? {
            url: primaryImage.url,
            width: primaryImage.width,
            height: primaryImage.height,
            alt: primaryImage.alt,
          }
        : undefined,
    },
    merchant: {
      ...merchantDefaults,
      ...product.merchant,
    },
    schema: {
      ...schemaDefaults,
      ...product.schema,
    },
  };
}

export const productCatalog = Object.fromEntries(
  Object.entries(baseProductCatalog).map(([productKey, product]) => [
    productKey,
    createCatalogEntry(productKey, product),
  ])
);

export function getProductCatalogEntry(productKey) {
  const product = productCatalog[productKey];

  if (!product || typeof product !== 'object') {
    throw new Error(`Unknown product catalog key "${productKey}"`);
  }

  return product;
}

export const productDefinitions = Object.fromEntries(
  Object.entries(productCatalog).map(([productKey, product]) => [
    productKey,
    {
      name: product.name,
      variantSkus: product.variantSkus,
      shippingSku: product.shippingSku,
    },
  ])
);
