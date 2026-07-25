export const commerceMessages = Object.freeze({
  shippingSchedule: Object.freeze({
    mondayOnly:
      'Eläviä matoja sisältävät lähetykset postitetaan vain maanantaisin, jotta madot eivät jää viikonlopuksi Postin kuljetukseen.',
    worms: 'Lauantai on viimeinen tilauspäivä seuraavan maanantain lähetykseen.',
    compostChow:
      'Kuituseos postitetaan maanantaisin. Lauantai on viimeinen tilauspäivä seuraavan maanantain lähetykseen.',
    preparedWormBin:
      'Käyttövalmiin matokompostorin sisältävä tilaus postitetaan kolmantena tilaushetkeä seuraavana maanantaina. Näin kompostori saa asettua noin kaksi viikkoa pidempään kuin tavallinen matotilaus.',
  }),
  shippingOptions: Object.freeze({
    postiPickup: Object.freeze({
      label: 'Nouto Postista tai automaatista',
      helperTexts: Object.freeze([
        'Paketti toimitetaan valitsemaasi Postin noutopisteeseen. Huomaa, että Posti voi ohjata lähetyksen toiseen noutopisteeseen, jos esimerkiksi valitsemasi noutopaikka on täynnä.',
      ]),
    }),
    postiHome: Object.freeze({
      label: 'Postin kotiinkuljetus sovittuna aikana',
      helperTexts: Object.freeze([
        'Posti sopii jakeluajan kanssasi OmaPosti-sovelluksen kautta, tekstiviestillä tai sähköpostitse.',
      ]),
    }),
    localPickup: Object.freeze({
      label: 'Nouto Järvenpäästä',
      helperTexts: Object.freeze([
        'Jos valitset toimitustavaksi noudon, olen sinuun yhteydessä, jotta voimme sopia noudosta tarkemmin',
      ]),
    }),
  }),
  addOns: Object.freeze({
    preparedWormBin: Object.freeze({
      name: 'Käyttövalmis 14 litran matokompostori',
      label: 'Käyttövalmis 14 litran matokompostori',
      imageAlt:
        'Avattu 14 litran matokompostori, jossa on valmiiksi kostutettu petimateriaali',
    }),
    smallCompostChow: Object.freeze({
      name: 'Lieromaan matokompostorin kuituseos',
      label: 'Kuituseos 150 g',
      description: 'Pieni pakkaus on saatavilla vain matopaketin lisävalintana.',
    }),
  }),
  order: Object.freeze({
    default: Object.freeze({
      variantLegend: 'Valitse määrä',
      submitButtonLabel: 'Lähetä sitova tilaus',
    }),
    worms: Object.freeze({
      variantLegend: 'Valitse matojen paino',
      variantDescriptionPrefix: 'Voit arvioida taloudellesi sopivan aloitusmäärän',
      variantDescriptionLinkLabel: 'matolaskurilla',
      variantLabel({ weight, estimatedWormCount, priceFormatted }) {
        const estimateText = estimatedWormCount
          ? ` (noin ${estimatedWormCount} matoa)`
          : '';
        return `${weight} g${estimateText} - ${priceFormatted} €`;
      },
      submitButtonLabel: 'Lähetä tilaus',
    }),
    compostChow: Object.freeze({
      variantLegend: 'Pakkauskoko',
      variantDescription: 'Valitse käyttömäärään sopiva pakkauskoko.',
      variantLabel({ weight, priceFormatted }) {
        return `${weight} g - ${priceFormatted} €`;
      },
      submitButtonLabel({ totalFormatted }) {
        return `Lähetä tilaus (${totalFormatted} €)`;
      },
    }),
    invoiceTiming: Object.freeze({
      postal: 'Lasku lähetetään, kun tilaus on toimitettu Postin kuljetettavaksi',
      localPickup: 'Lasku lähetetään, kun olet noutanut tilauksen',
    }),
  }),
  extraCharges: Object.freeze({
    frostProtection: Object.freeze({
      label: 'Pakkastoimituslisä',
      checkboxLabel: 'Maksan pakkastoimituslisän',
      descriptionLines: Object.freeze([
        'Kun ulkolämpötila on alle -5 C, matojen toimittaminen vaatii ylimääräistä pakkausmateriaalia matojen pitämiseksi elossa. Pakkastilanne määritetään alimmasta lämpötilaennusteesta matojen lähtöpaikan (Järvenpää) ja toimitusosoitteen perusteella.',
      ]),
      helperTextLines: Object.freeze([
        'Voit tehdä tilauksen myös ilman pakkaslisää, vaikka ulkona olisi pakkasta, jolloin paketti toimitetaan pikimmiten sään lämmettyä.',
      ]),
    }),
  }),
  cart: Object.freeze({
    productNames: Object.freeze({
      worms: 'Kompostimadot (Eisenia fetida)',
      compostChow: 'Lieromaan matokompostorin kuituseos',
    }),
    wormLineLabel({ weight, estimatedWormCount }) {
      const estimateText = estimatedWormCount
        ? ` (noin ${estimatedWormCount} matoa)`
        : '';
      return `${weight} g kompostimatoja${estimateText}`;
    },
    errors: Object.freeze({
      unknown_product: ({ sku }) => `Tuntematon tuote "${sku}".`,
      product_unavailable: ({ sku }) =>
        `Tuote "${sku}" ei ole tällä hetkellä saatavilla.`,
      prepared_bin_requires_worms: () =>
        'Käyttövalmiin matokompostorin voi tilata vain kompostimatojen kanssa.',
      prepared_bin_limit: () =>
        'Jokaista matopakettia kohden voi tilata enintään yhden käyttövalmiin matokompostorin.',
      small_fibre_mix_requires_worms: () =>
        'Kuituseoksen 150 g pakkauksen voi tilata vain matopaketin lisävalintana.',
      worm_package_limit: ({ limit }) =>
        `Yhdessä tilauksessa voi olla enintään ${limit} matopakettia.`,
      fibre_mix_limit: ({ limit }) =>
        `Yhdessä tilauksessa voi olla enintään ${limit} kuituseosta.`,
      invalid_shipping_method: () => 'Valittu toimitustapa ei ole kelvollinen.',
      cart_empty: () => 'Ostoskori on tyhjä.',
      cart_update_failed: () => 'Korin päivittäminen epäonnistui.',
      cart_validation_failed: () =>
        'Tilauksen tuotetietoja ei voitu varmistaa. Päivitä sivu ja yritä uudelleen.',
      order_quote_failed: () => 'Tilauksen laskeminen epäonnistui.',
    }),
  }),
});

export default commerceMessages;
