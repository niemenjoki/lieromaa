export const productMessages = Object.freeze({
  deliveryNotice: Object.freeze({
    heading: 'Toimitus vain Suomeen',
    body: 'Toimitamme osoitteisiin ja Postin noutopisteisiin Suomessa. Paikallinen nouto on saatavilla Järvenpäässä.',
  }),
  collection: Object.freeze({
    title: 'Tuotteet | Lieromaa',
    description:
      'Lieromaan tuotteet matokompostoinnin aloittamiseen ja ylläpitoon: kompostimadot, käyttövalmis 14 litran matokompostori ja kompostorin kuituseos.',
    pageName: 'Tuotteet',
    h1: 'Lieromaan tuotteet',
    lead: 'Kompostimadot, käyttövalmis 14 litran matokompostori ja kompostorin ylläpitoa helpottava kuituseos samasta paikasta.',
    unavailable: 'Ei saatavilla',
  }),
  catalog: Object.freeze({
    worms: Object.freeze({
      pageName: 'Osta kompostimatoja – Eisenia fetida matokompostointiin',
      title: 'Osta kompostimatoja | Lieromaa',
      description:
        'Tilaa kotimaisia kompostimatoja koko Suomeen. Valitse pelkät madot tai madot käyttövalmiissa 14 litran matokompostorissa.',
      pageDescription:
        'Tilaa kotimaisia kompostimatoja (Eisenia fetida) postitse tai nouda Järvenpäästä. Voit valita pelkät madot tai käyttövalmiin 14 litran matokompostorin, jossa madot ovat jo asettuneet petimateriaaliin.',
      h1: 'Osta Lieromaan Eisenia fetida -kompostimatoja',
      productName: 'Kompostimadot (Eisenia fetida)',
      productDescription:
        'Kotimaiset kompostimadot (Eisenia fetida) matokompostointiin. Myynnissä 25 g, 50 g, 75 g ja 100 g pakkauksina.',
      imageAlts: Object.freeze([
        'Kompostimatoja ja matokompostin sisältöä kämmenellä',
        'Kompostimadot toimituspakkauksessa',
      ]),
      schema: Object.freeze({
        material: 'Kompostimulta, pahvisilppu, puukuitu, kookoskuitu',
        returnPolicyName: 'Peruuttamisoikeus',
        returnPolicyText:
          'Postitettuja matotilauksia ei voi peruuttaa, koska kompostimatoja ei voida palautuksen jälkeen käsitellä tai myydä edelleen tavanomaisena tuotteena. Jos tuotteessa tai toimituksessa on virhe, asia käsitellään erikseen asiakaspalvelun kautta.',
      }),
    }),
    compostChow: Object.freeze({
      pageName: 'Lieromaan matokompostorin kuituseos',
      title: 'Matokompostorin kuituseos | Lieromaa',
      description:
        'Lieromaan kompostorin kuituseos on helppokäyttöinen lisäseos kompostiin. Se helpottaa kompostin ylläpitoa erityisesti silloin, kun biojätteen määrä vaihtelee.',
      pageDescription:
        'Helppokäyttöinen kuituseos matokompostin tasapainottamiseen ja ruokinnan tukemiseen.',
      h1: 'Lieromaan matokompostorin kuituseos',
      productName: 'Lieromaan matokompostorin kuituseos',
      productDescription:
        'Helppokäyttöinen lisäseos kompostiin. Helpottaa kompostin ylläpitoa erityisesti silloin, kun biojätteen määrä vaihtelee.',
      imageAlts: Object.freeze([
        'Lieromaan kompostorin kuituseoksen pakkaus vaaleaa taustaa vasten',
        'Kuituseoksen lisääminen lusikalla matokompostoriin',
        'Lieromaan kompostorin kuituseos ja annostelulusikka',
      ]),
      schema: Object.freeze({
        material:
          'Vehnälese, kauralese, soijarouhe, vehnäjauho, puutarhakalkki, zeoliitti, basaltti',
        returnPolicyName: 'Peruuttamisoikeus',
        returnPolicyText:
          'Avaamattomalla ja käyttämättömällä kuituseoksella on 14 vrk peruuttamisoikeus tilaus- ja toimitusehtojen mukaisesti. Jos tuotteessa tai toimituksessa on virhe, asia käsitellään erikseen asiakaspalvelun kautta.',
      }),
    }),
  }),
  addToCart: Object.freeze({
    relatedLegend: ({ productName }) => `Valitse tuotteen ${productName} pakkauskoko`,
    noRelatedProduct: 'Ei kuituseosta',
    quantityInCart: 'Ostoskorissa',
    addedOne: 'Tuote lisättiin ostoskoriin.',
    addedMany: 'Tuotteet lisättiin ostoskoriin.',
    addFailed: 'Tuotteiden lisääminen epäonnistui.',
    quantityFailed: 'Määrän päivittäminen epäonnistui.',
    heading: 'Lisää ostoskoriin',
    variantLegend: 'Valitse vaihtoehto',
    unavailable: 'Ei saatavilla juuri nyt.',
    notOrderable: 'Tuote ei ole tällä hetkellä tilattavissa.',
    remove: 'Poista',
    relatedHeading: 'Kuituseos',
    relatedDescription:
      'Voit lisätä samaan tilaukseen kompostin ylläpitoa helpottavan kuituseoksen.',
    reviewOrder: 'Siirry tarkistamaan tilaus',
    goToCart: 'Siirry ostoskoriin',
    continueShopping: 'Jatka ostoksia',
    addButton: 'Lisää ostoskoriin',
  }),
  preparedBin: Object.freeze({
    heading: 'Valitse aloitustapa',
    description:
      'Tilaa pelkät madot omaan kompostoriisi tai valitse käyttövalmis 14 litran matokompostori, joka on valmisteltu ja käynnistetty puolestasi.',
    newBadge: 'Uusi',
    shortTitle: 'Valmis matokompostori',
    infoLabel: 'Lisätietoa käyttövalmiista matokompostorista',
    closeLabel: 'Sulje lisätiedot',
    promise:
      'Osta, vastaanota ja aloita ruokinta – matokompostoinnin aloittaminen ei juuri helpommaksi muutu.',
    intro:
      'Saat valitsemasi määrän kompostimatoja valmiiksi käynnistetyssä 14 litran kompostorissa. Erillistä kokoamista, petimateriaalin valmistelua tai käyttöönottoa ei tarvita.',
    sections: Object.freeze([
      Object.freeze({
        heading: 'Mitä matokompostori sisältää?',
        paragraphs: Object.freeze(['Kompostoriin kuuluu:']),
        bullets: Object.freeze([
          'ilmanvaihtoaukoilla varustettu 14 litran muovilaatikko',
          'valitsemasi määrä kompostimatoja',
          'sopivan kosteaksi valmisteltu petimateriaali',
          'pieni määrä aiemmin käytössä ollutta, hyvin toimivaa petimateriaalia',
          'ensimmäinen maltillinen ruokinta',
        ]),
      }),
      Object.freeze({
        heading: 'Miten matokompostori käynnistetään?',
        paragraphs: Object.freeze([
          'Valmistelen petimateriaalin sopivan kosteaksi ja sekoitan siihen pienen määrän aiemmin toiminnassa ollutta petimateriaalia. Se tuo uuteen kompostoriin valmiin mikrobikannan ja auttaa hajotustoimintaa käynnistymään nopeammin.',
          'Tämän jälkeen lisään valitsemasi madot ja ensimmäisen pienen ruoka-annoksen. Kompostori saa toimia noin kaksi viikkoa ennen lähetystä.',
        ]),
        bullets: Object.freeze([]),
      }),
      Object.freeze({
        heading: 'Kun matokompostori saapuu',
        paragraphs: Object.freeze([
          'Kompostori on saapuessaan valmis käytettäväksi sellaisenaan. Valitse sille sopiva paikka ja aloita jatkoruokinta varovasti.',
          'Kompostoria ei tarvitse koota, eikä petimateriaalia tarvitse erikseen kostuttaa tai valmistella.',
        ]),
        bullets: Object.freeze([]),
      }),
      Object.freeze({
        heading: 'Toimitusaika',
        paragraphs: Object.freeze([
          'Käyttövalmis kompostori lähetetään kolmantena tilauksen jälkeisenä maanantaina.',
          'Noin kahden viikon valmisteluaika tarvitaan siihen, että madot ehtivät kotiutua ja kompostorin mikrobitoiminta käynnistyä ennen kuljetusta.',
        ]),
        bullets: Object.freeze([]),
      }),
      Object.freeze({
        heading: 'Millainen matokompostori on?',
        paragraphs: Object.freeze([
          'Kompostori on kestävä, elintarvikekelpoisesta muovista valmistettu 14 litran laatikko, jonka ulkomitat ovat 40 × 30 × 19 cm. Tarvittavat ilmanvaihtoaukot on tehty valmiiksi.',
        ]),
        bullets: Object.freeze([]),
      }),
    ]),
    legend: 'Valitse matokompostoinnin aloitustapa',
    wormsOnly: 'Pelkät madot',
    optionTitle: 'Valmis 14L matokompostori',
    shippingDelay:
      'Valmisteluaika on noin kaksi viikkoa. Käyttövalmis kompostori lähetetään kolmantena tilauksen jälkeisenä maanantaina, jotta petimateriaalin mikrobitoiminta ehtii käynnistyä ja madot kotiutua ennen kuljetusta.',
    alreadyInCart:
      'Käyttövalmis matokompostori on jo ostoskorissa. Voit poistaa sen ostoskorissa.',
  }),
  availability: Object.freeze({
    limitedAndDelayed:
      'Olen joutunut rajoittamaan isompien matopakettien myyntiä sekä viivästyttämään tilausten lähettämistä suuren kysynnän vuoksi. Pienempiä tilauksia voi tehdä normaalisti. Nyt tehtävät tilaukset toimitetaan ',
    limited:
      'Olen joutunut rajoittamaan isompien matopakettien myyntiä suuren kysynnän vuoksi. Pienempiä tilauksia voi tehdä normaalisti.',
    delayed:
      'Joudun viivästyttämään tilausten lähettämistä suuren kysynnän vuoksi. Nyt tehtävät tilaukset toimitetaan ',
  }),
  price: Object.freeze({
    unavailable: 'Ei saatavilla',
    lowestPricePrefix: '30 päivän alin hinta ennen tätä alennusta:',
    offerValid: 'Tarjous voimassa',
    offerUntil: 'asti.',
  }),
  reviews: Object.freeze({
    heading: 'Asiakasarvostelut',
    verifiedCount: ({ count }) => `${count} vahvistetun ostajan arvostelua`,
    distributionLabel: 'Tähtijakauma',
    starLabel: ({ value }) => (value === 1 ? '1 tähti' : `${value} tähteä`),
    hideWritten: 'Piilota kirjoitetut arvostelut',
    showWritten: ({ count }) => `Näytä kirjoitetut arvostelut (${count})`,
    anonymous: '<nimetön>',
    reviewStarLabel: ({ rating }) => `${rating} / 5 tähteä`,
    finnishNotice: 'Nämä asiakaskommentit ovat alkuperäiskielellään suomeksi.',
    finnishBadge: 'FI · Arvostelu suomeksi',
    showMore: ({ count }) => `Näytä ${count} lisää arvostelua`,
    showRest: 'Näytä loput arvostelut',
    ratingOnly: ({ count }) =>
      `${count} ${count === 1 ? 'asiakas jätti' : 'asiakasta jätti'} pelkän tähtiarvion. Nämä arvostelut ovat mukana keskiarvossa ja tähtijakaumassa.`,
  }),
  imageSlider: Object.freeze({
    firstSlide: 'Tämä on ensimmäinen kuva',
    lastSlide: 'Tämä on viimeinen kuva',
    nextSlide: 'Seuraava kuva',
    previousSlide: 'Edellinen kuva',
    paginationBullet: 'Siirry kuvaan {{index}}',
  }),
});

export default productMessages;
