export const pageMessages = Object.freeze({
  moreInFinnish: Object.freeze({
    heading: 'Lisää matokompostointisisältöä on saatavilla suomeksi',
    description:
      'Lieromaalla on laajempi opas- ja blogikirjasto, jota ei ole vielä käännetty. Englanninkielinen osio sisältää tuotteet, laskurin, kassan ja tilaamiseen tarvittavat asiakaspalvelusivut.',
    guidesLabel: 'Matokompostointioppaat',
    blogLabel: 'Lieromaan blogi',
    badge: 'FI · Suomeksi',
  }),
  wormCalculator: Object.freeze({
    title: 'Matolaskuri',
    description:
      'Syötä kotitaloutesi tiedot ja laskuri arvioi tuottamasi biojätteen määrän sekä tarvittavan matojen painon.',
    whyHeading: 'Miksi laskuri on hyödyllinen?',
    whyBody:
      'Kompostimatojen aloitusmäärän mitoittaminen oikein auttaa pitämään kompostorin tasapainossa. Liian pieni määrä matoja ei ehdi käsittelemään kaikkea jätettä, ja liian suuri määrä matoja taas kärsii ruoan puutteesta. Laskurin avulla saat karkean arvion siitä, kuinka paljon matoja kotitaloutesi tuottaman biojätteen käsittelyyn tarvitaan painona.',
    productPrompt: 'Jos sinulla ei vielä ole matoja, voit ostaa niitä',
    productLinkLabel: 'täältä',
    calculatorHeading: 'Laskuri',
    calculatorIntro:
      'Arvio perustuu kotitalouden kokoon, ruokavalioon ja oletukseen, että matojen määrä kaksinkertaistuu noin 3 kuukaudessa. Tulokset ovat suuntaa-antavia - käytännössä biojätteen määrä ja matojen syönti riippuvat mm. lämpötilasta, kosteudesta ja ruoan laadusta.',
    formHeading: 'Syötä kotitalouden tiedot',
    formHelp:
      'Laskurin tulos päivittyy automaattisesti, kun valitset talouden koon ja ruokavalion.',
    fields: Object.freeze({
      adults: 'Aikuiset',
      teens: 'Teinit (13-17 v.)',
      children: 'Lapset (4-12 v.)',
      toddlers: 'Taaperot (1-3 v.)',
      diet: 'Ruokavalio',
    }),
    diets: Object.freeze({
      omnivore: 'Sekaruokavalio',
      plantForward: 'Kasvispainotteinen',
      vegetarian: 'Kasvis',
      vegan: 'Vegaani',
    }),
    resultsHeading: 'Tulokset',
    emptyResult:
      'Täytä kotitalouden henkilömäärät, niin laskuri näyttää arvion syntyvän biojätteen määrästä ja sopivasta matojen painosta.',
    scrapsResult({ min, max }) {
      return `Kotitaloutesi tuottaa arviolta ${min} - ${max} g biojätettä viikossa.`;
    },
    wormResultPrefix: 'Sen käsittelemiseen tarvitaan noin',
    wormResultUnit: 'g matoja',
    resultExplanation:
      'Koko suositellun määrän hankkimalla kompostori toimii heti täydellä teholla. Toinen vaihtoehto on hankkia pienempi määrä matoja ja odottaa, että ne lisääntyvät.',
    halfStart({ weight }) {
      return `Jos aloitat noin ${weight} grammalla, kestää noin 3 kuukautta, että sinulla on tarvittava määrä matoja.`;
    },
    quarterStart({ weight }) {
      return `Jos aloitat noin ${weight} grammalla, aikaa kuluu noin 6 kuukautta.`;
    },
    eighthStart({ weight }) {
      return `Vähimmäisvaihtoehtona ${weight} grammalla kompostori toimii täysillä noin vuoden kuluttua.`;
    },
    finePrint:
      'Laskelma perustuu oletukseen, että yksi mato painaa noin 0.5 g ja syö noin 1 g biojätettä viikossa. Matojen määrä tuplaantuu keskimäärin 3 kuukauden välein.',
    tipsHeading: 'Vinkkejä tulosten tulkintaan',
    tips: Object.freeze([
      'Jos aloitat pienellä määrällä, anna matojen määrän kasvaa rauhassa - vältä liiallista ruokintaa.',
      'Jos aloitat suurella määrällä, varmista että biojätettä riittää heti alusta asti.',
      'Muista, että matojen kasvu ja syönti vaihtelevat kompostorin olosuhteiden mukaan.',
    ]),
    share: Object.freeze({
      heading: 'Jaa tämä somessa:',
      facebook: 'Jaa Facebookissa',
      x: 'Jaa X:ssä',
      whatsapp: 'Jaa WhatsAppissa',
      linkedin: 'Jaa LinkedInissä',
    }),
    recommendationsHeading: 'Aiheeseen liittyvää luettavaa',
  }),
});

export default pageMessages;
