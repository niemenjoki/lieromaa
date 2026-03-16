export const productDefinitions = {
  worms: {
    name: 'Kompostimadot',
    variantSkus: ['worms-50', 'worms-100', 'worms-200'],
    shippingSku: 'postage-worms',
  },
  starterKit: {
    name: 'Matokompostorin aloituspakkaus',
    variantSkus: ['starterkit-50', 'starterkit-100', 'starterkit-200'],
    shippingSku: 'postage-starterkit',
  },
};

export const merchantCatalog = {
  worms: {
    title(amount) {
      return `Kompostimadot (${amount} kpl) | Eisenia fetida`;
    },
    description(amount) {
      return `Kotimaiset kompostimadot (${amount} kpl) matokompostointiin. Eisenia fetida -madot toimitetaan omassa kasvualustassaan, ja ne sopivat biojätteen hajuttomaan käsittelyyn sisällä tai ulkona.`;
    },
    linkPath: '/tuotteet/madot',
    brand: 'Lieromaa',
    availability: 'in_stock',
    condition: 'new',
    identifierExists: 'no',
    productType: 'Matokompostointi > Kompostimadot',
    shippingService: 'Posti',
    imagePaths: [
      '/images/wormspage/kompostimadot_kammenella.avif',
      '/images/wormspage/madot_toimituspakkauksessa.avif',
    ],
  },
  starterKit: {
    title(amount) {
      return `Matokompostorin aloituspakkaus + ${amount} kompostimatoa`;
    },
    description(amount) {
      return `Lieromaan aloituspakkaus sisältää kolmen laatikon läpivirtauskompostorin, petimateriaalin ja ${amount} kompostimatoa. Paketti on suunniteltu helppoon matokompostoinnin aloitukseen kotona.`;
    },
    linkPath: '/tuotteet/matokompostin-aloituspakkaus',
    brand: 'Lieromaa',
    availability: 'in_stock',
    condition: 'new',
    identifierExists: 'no',
    productType: 'Matokompostointi > Matokompostorit > Aloituspakkaukset',
    shippingService: 'Posti',
    imagePaths: [
      '/images/starterkit/aloituspakkaus_suljettu_matokompostori.avif',
      '/images/starterkit/aloituspakkaus_sisalto_ylhaalta_kuvattuna.avif',
      '/images/starterkit/aloituspakkaus_kompostimadot_toimitusastiassa.avif',
      '/images/starterkit/aloituspakkaus_kompostimadot_lahella.avif',
    ],
  },
};
