export const sharedPickupHelperTexts = [
  'Voit toivoa tiettyä Postin noutopaikkaa (pakettiautomaatti tai postitoimipaikka). Toiveen tulee löytyä Postin palvelupistekartalta. Jos et toivo noutopaikkaa, lähetys toimitetaan ilmoittamasi postinumeron mukaan ensimmäiseen Postin tarjoamaan noutopisteeseen.',
  'Huomioithan, että Posti saattaa toiveesta huolimatta toimittaa paketin eri toimipisteeseen, jos esimerkiksi noutopiste on täynnä.',
];

export const productCatalogSource = {
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
      navigationLabel: 'Kompostimadot',
      updatedAt: '2025-10-07',
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
      variantLegend: 'Valitse määrä',
      variantSelectorPosition: 'afterFulfillment',
      showWormAmountFinePrint: true,
      getVariantLabel({ amount, priceFormatted }) {
        return `${amount} matoa - ${priceFormatted} €`;
      },
      shippingHelperTexts: sharedPickupHelperTexts,
      submitButtonLabel() {
        return 'Lähetä sitova tilaus';
      },
      confirmationNote:
        'Saat manuaalisen vahvistuksen ja laskun sähköpostiisi 1-2 arkipäivän sisällä.',
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
    shippingSku: 'postage-starterkit',
    page: {
      canonicalUrl: '/tuotteet/matokompostin-aloituspakkaus',
      pageName: 'Matokompostorin aloituspakkaus ja madot',
      description:
        'Lieromaan aloituspakkaus tekee aloituksesta helppoa: kolmen laatikon kompostori, petimateriaali ja kompostimadot valmiina käyttöön.',
      h1: 'Lieromaan matokompostorin aloituspakkaus on nyt tilattavissa',
      navigationLabel: 'Aloituspakkaus',
      updatedAt: '2026-03-01',
    },
    search: {
      contexts: ['blog', 'notFound'],
      title: 'Matokompostorin aloituspakkaus',
      keywords: ['aloituspakkaus', 'matokompostori', 'kompostori', 'kompostimadot'],
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
        'Aloituspakkauksella on 14 vrk peruuttamisoikeus itse pakkauksen osalta. Pakettiin sisältyvien kompostimatojen osuutta ei hyvitetä, jos lähetys on ehditty toimittaa.',
    },
    order: {
      defaultVariantAmount: 100,
      variantLegend: 'Valitse paketti',
      variantSelectorPosition: 'beforeFulfillment',
      showWormAmountFinePrint: true,
      getVariantLabel({ amount, priceFormatted }) {
        return `Aloituspakkaus + ${amount} matoa - ${priceFormatted} €`;
      },
      shippingHelperTexts: sharedPickupHelperTexts,
      submitButtonLabel({ totalFormatted }) {
        return `Lähetä sitova tilaus (${totalFormatted} €)`;
      },
      confirmationNote: 'Saat manuaalisen tilausvahvistuksen 1-2 arkipäivässä.',
    },
  },
};
