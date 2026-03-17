export const standalonePageDefinitions = {
  blogIndex: {
    canonicalUrl: '/blogi',
    pageName: 'Blogi',
    title: 'Blogi | Lieromaa',
    description:
      'Lieromaan blogi käsittelee matokompostointia, kompostimatoja ja kestävää jätteenkäsittelyä.',
    shortLabel: 'Blogi',
    search: {
      contexts: ['notFound'],
      keywords: ['blogi', 'julkaisut', 'artikkelit', 'matokompostointi'],
    },
  },
  wormCalculator: {
    canonicalUrl: '/matolaskuri',
    pageName: 'Matolaskuri – arvioi tarvittava kompostimatojen määrä',
    title: 'Matolaskuri | Lieromaa',
    description:
      'Syötä kotitaloutesi tiedot ja laskuri arvioi tuottamasi biojätteen määrän sekä tarvittavan matomäärän.',
    pageDescription:
      'Lieromaan matolaskuri auttaa arvioimaan, kuinka paljon kompostimatoja (Eisenia fetida) tarvitaan kotitalouden biojätteen käsittelyyn. Syötä perheesi koko ja ruokavalio, ja laskuri kertoo suuntaa-antavan määrän.',
    shortLabel: 'Matolaskuri',
    updatedAt: '2025-10-07',
    search: {
      contexts: ['blog', 'notFound'],
      keywords: ['matolaskuri', 'kompostimadot', 'laskuri', 'lieromaa', 'työkalut'],
    },
    mainEntityName: 'Kompostimatojen määrän laskuri',
    mainEntityDescription:
      'Interaktiivinen työkalu, joka arvioi biojätteen määrän ja siihen tarvittavan kompostimatojen populaation.',
  },
  about: {
    canonicalUrl: '/tietoa',
    pageName: 'Tietoa Lieromaasta',
    description:
      'Tutustu Lieromaan perustajaan Joonas Niemenjokeen ja siihen, miten sivusto syntyi käytännön matokompostointikokemusten pohjalta.',
    shortLabel: 'Tietoa Lieromaasta',
    updatedAt: '2025-09-08',
    search: {
      contexts: ['notFound'],
      keywords: ['tietoa', 'lieromaa', 'joonas niemenjoki', 'sivusto'],
    },
  },
};
