export const starterKitSetupPageDefinition = {
  canonicalUrl: '/tuotteet/matokompostin-aloituspakkaus/kayttoonotto',
  pageName: 'Aloituspakkauksen käyttöönotto',
  title: 'Aloituspakkauksen käyttöönotto | Lieromaa',
  description:
    'Näin käynnistät aloituspakkauksen oikein: oikea kosteus, laatikoiden kerrokset, matojen totuttelu ja ensimmäiset ruokinnat.',
  updatedAt: '2026-03-03',
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
      'Kompostimadot ja vanhaa petimateriaalia sisältävä rasia',
    ],
    tools: ['Mitta-astia (4.5 litraa vettä)', 'Kädet, kauha tai lusikka sekoitukseen'],
    steps: [
      {
        name: 'Kookoskuidun kostutus pohjalaatikossa',
        text: 'Poista matorasia ja lisää kuiva kookoskuitu umpipohjaiseen laatikkoon. Kaada joukkoon 4.5 litraa vettä tasaisesti koko pinnalle. Anna veden imeytyä 30 minuuttia ja sekoita kerran noin puolessa välissä, jotta kosteus jakautuu tasaisemmin.',
      },
      {
        name: 'Kerrosten rakentaminen',
        text: "Siirrä kostutettua materiaalia rei'itettyihin laatikoihin niin, että pohjalaatikkoon jää vain kevyt kerros. Kun laatikot pinotaan, petimateriaalin tulee painautua kevyesti mutta pysyä ilmavana.",
      },
      {
        name: 'Matojen lisääminen ja totuttelu',
        text: 'Kaada madot ylimpään laatikkoon petimateriaalin päälle ja anna niiden kaivautua rauhassa. Sulje kansi ja anna matojen sopeutua ilman ruokintaa kaksi vuorokautta.',
      },
      {
        name: 'Ensimmäinen ruokinta',
        text: 'Aloita kahden vuorokauden jälkeen pienellä annoksella, esimerkiksi ruokalusikallisella banaania. Lisää uutta ruokaa vasta, kun edellinen annos on kadonnut kokonaan.',
      },
    ],
  },
};
