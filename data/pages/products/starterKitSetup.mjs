export const starterKitSetupPageDefinition = {
  canonicalUrl: '/tuotteet/matokompostin-aloituspakkaus/kayttoonotto',
  pageName: 'Aloituspakkauksen käyttöönotto',
  title: 'Aloituspakkauksen käyttöönotto | Lieromaa',
  description:
    'Näin käynnistät aloituspakkauksen oikein: yksi aktiivinen kerros alkuun, oikea kosteus, matojen totuttelu ja uusien kerrosten lisääminen vasta myöhemmin.',
  updatedAt: '2026-04-13',
  image: {
    url: '/images/content/aloituspakkauksen_aloitus.avif',
    width: 1200,
    height: 900,
    alt: 'Matokompostorin aloituspakkauksen käyttöönotto',
  },
  parentPageCanonicalUrl: '/tuotteet/matokompostin-aloituspakkaus',
  parentPageName: 'Matokompostorin aloituspakkaus',
  howTo: {
    name: 'Matokompostorin aloituspakkauksen käyttöönotto',
    supplies: [
      'Umpipohjainen laatikko (1 kpl)',
      "Rei'itetty laatikko (2 kpl)",
      'Kansi (1 kpl)',
      'Kuiva kookoskuitu',
      'Kompostimadot ja vanhaa petimateriaalia sisältävä rasia, jos tilasit madot mukaan',
    ],
    tools: ['Mitta-astia (4.5 litraa vettä)', 'Kädet, kauha tai lusikka sekoitukseen'],
    steps: [
      {
        name: 'Kookoskuidun kostutus pohjalaatikossa',
        text: 'Jos tilasit madot mukaan, siirrä matorasia sivuun. Lisää kuiva kookoskuitu umpipohjaiseen laatikkoon. Kaada joukkoon 4.5 litraa vettä tasaisesti koko pinnalle. Anna veden imeytyä 30 minuuttia ja sekoita kerran noin puolessa välissä, jotta kosteus jakautuu tasaisemmin.',
      },
      {
        name: 'Ensimmäisen kerroksen käynnistys',
        text: 'Siirrä kostutettu materiaali ensimmäiseen laatikkoon ja pidä muut laatikot aluksi tyhjinä. Kompostointi käynnistetään yhdellä aktiivisella kerroksella, ei täyttämällä kaikkia kerroksia heti.',
      },
      {
        name: 'Matojen lisääminen ja totuttelu',
        text: 'Jos tilasit madot mukaan, kaada madot samaan laatikkoon petimateriaalin päälle ja anna niiden kaivautua rauhassa. Sulje kansi ja anna matojen sopeutua ilman ruokintaa kaksi vuorokautta.',
      },
      {
        name: 'Ensimmäinen ruokinta ja uudet kerrokset',
        text: 'Aloita kahden vuorokauden jälkeen pienellä annoksella, esimerkiksi ruokalusikallisella banaania. Lisää uusi laatikko päälle vasta, kun nykyinen ylin kerros on osittain käsitelty, ja ruoki aina vain ylimmässä kerroksessa. Kun kaikki laatikot ovat käytössä, kerää alin kerros ja siirrä ylempien kerrosten sisältö käsin yhden tason alas.',
      },
    ],
  },
};
