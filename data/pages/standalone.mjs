export const standalonePageDefinitions = {
  blogIndex: {
    canonicalUrl: '/blogi',
    pageName: 'Blogi',
    title: 'Blogi | Lieromaa',
    description:
      'Lue Lieromaan blogista käytännön vinkit matokompostorin hoitoon, kompostimatojen käyttöön ja kodin biojätteen fiksuun käsittelyyn.',
    shortLabel: 'Blogi',
    search: {
      contexts: ['notFound'],
      keywords: ['blogi', 'julkaisut', 'artikkelit', 'matokompostointi'],
    },
  },
  wormCalculator: {
    canonicalUrl: '/matolaskuri',
    pageName: 'Matolaskuri – arvioi tarvittava kompostimatojen paino',
    title: 'Matolaskuri | Lieromaa',
    description:
      'Lieromaan matolaskuri auttaa arvioimaan kotitaloutesi biojätteen määrän ja sen, kuinka paljon kompostimatoja tarvitset painona.',
    pageDescription:
      'Lieromaan matolaskuri auttaa arvioimaan, kuinka paljon kompostimatoja (Eisenia fetida) tarvitaan kotitalouden biojätteen käsittelyyn painona. Syötä perheesi koko ja ruokavalio, ja laskuri kertoo suuntaa-antavan määrän.',
    shortLabel: 'Matolaskuri',
    updatedAt: '2026-04-28',
    search: {
      contexts: ['blog', 'notFound'],
      keywords: ['matolaskuri', 'kompostimadot', 'laskuri', 'lieromaa', 'työkalut'],
    },
    mainEntityName: 'Kompostimatojen painon laskuri',
    mainEntityDescription:
      'Interaktiivinen työkalu, joka arvioi biojätteen määrän ja siihen tarvittavan kompostimatojen painon.',
  },
  about: {
    canonicalUrl: '/tietoa',
    pageName: 'Tietoa Lieromaasta',
    description:
      'Tutustu Lieromaan perustajaan Joonas Niemenjokeen ja siihen, miten sivusto syntyi käytännön matokompostointikokemusten pohjalta.',
    shortLabel: 'Tietoa Lieromaasta',
    updatedAt: '2026-06-03',
    search: {
      contexts: ['notFound'],
      keywords: ['tietoa', 'lieromaa', 'joonas niemenjoki', 'sivusto'],
    },
  },
  wormSource: {
    canonicalUrl: '/tietoa/mista-lieromaan-madot-tulevat',
    pageName: 'Mistä Lieromaan kompostimadot tulevat?',
    title: 'Mistä Lieromaan kompostimadot tulevat? | Lieromaa',
    description:
      'Katso, missä Lieromaan kompostimadot kasvavat ennen tilausta: lämmitetyssä kotitallissa, pääkompostorissa ja varmistuslaatikoissa.',
    pageDescription:
      'Lieromaan kompostimadot kasvavat lämmitetyssä kotitallissa. Pääjärjestelmänä on kolmen 50 litran laatikon läpivirtauskompostori, ja kolme 14 litran laatikkoa toimivat varmistuksena sekä kokeilukompostoreina.',
    shortLabel: 'Mistä madot tulevat?',
    navigationLabel: 'Mistä madot tulevat?',
    updatedAt: '2026-06-03',
    image: {
      url: '/images/content/lieromaan_matojen_hoitopiste.avif',
      width: 1200,
      height: 900,
      alt: 'Lieromaan matojen hoitopiste ja pakkaustarvikkeet lämmitetyssä kotitallissa',
    },
    search: {
      contexts: ['blog', 'notFound'],
      title: 'Mistä Lieromaan madot tulevat?',
      description:
        'Lue, miten Lieromaan kompostimadot kasvavat ja miten tilattavat madot kerätään.',
      tags: ['tietoa', 'kompostimadot'],
      keywords: [
        'lieromaan madot',
        'mistä madot tulevat',
        'kompostimadot',
        'matojen kasvatus',
        'kotimaiset kompostimadot',
      ],
    },
    mainEntityName: 'Lieromaan kompostimatojen kasvatus',
    mainEntityDescription:
      'Kuvaus Lieromaan lämmitetyssä kotitallissa ylläpidetystä kompostimatojen pääkompostorista, varmistuslaatikoista ja tilausten keräämisestä.',
  },
  guideHub: {
    canonicalUrl: '/opas',
    pageName: 'Matokompostoinnin opas',
    title: 'Matokompostoinnin opas | Lieromaa',
    description:
      'Lieromaan opas kokoaa käytännön ohjeet matokompostorin perustamiseen, hoitoon ja matokakan hyödyntämiseen kotona.',
  },
};
