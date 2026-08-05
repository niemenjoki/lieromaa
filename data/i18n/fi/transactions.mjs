export const transactionMessages = Object.freeze({
  checkout: Object.freeze({
    steps: Object.freeze(['Kori', 'Toimitus', 'Maksu', 'Tiedot', 'Vahvistus']),
    pickupPointTypes: Object.freeze({
      parcelLocker: 'Pakettiautomaatti',
      servicePoint: 'Postin palvelupiste',
    }),
    quantityUpdateFailed: 'Määrän päivittäminen epäonnistui.',
    addressRequired: 'Anna osoite, postinumero ja postitoimipaikka ennen hakua.',
    postcodeInvalid: 'Anna suomalainen 5-numeroinen postinumero.',
    pickupSearchFailed: 'Noutopisteiden haku epäonnistui.',
    pickupSearchEmpty:
      'Noutopisteitä ei löytynyt tällä haulla. Kokeile toista postinumeroa tai tarkempaa osoitetta.',
    submitFailed: 'Tilauksen lähetys epäonnistui.',
    loadingCart: 'Ladataan ostoskoria...',
    successMessage:
      'Kiitos tilauksesta! Tilaus on vastaanotettu. Saat manuaalisen vahvistuksen sähköpostiisi 1–2 arkipäivän sisällä.',
    emptyMessage: 'Ostoskori on tyhjä.',
    successCancellation:
      'Jos haluat tehdä peruuttamisilmoituksen muusta syystä kuin tuotteen virheen vuoksi, voit käyttää',
    cancellationLink: 'peruuttamisilmoituksen lomaketta',
    successFollowUpLabel: 'Lue kompostoinnin oppaat',
    emptyFollowUpLabel: 'Katso tuotteet',
    headings: Object.freeze({
      cart: 'Ostoskori',
      shipping: 'Toimitustapa',
      payment: 'Maksu',
      contact: 'Yhteystiedot',
      summary: 'Yhteenveto',
    }),
    unitPrice: ({ price }) => `${price} € / kpl`,
    quantity: 'Määrä',
    fixedQuantity: 'Määrä 1',
    addOns: 'Lisävalinnat',
    remove: 'Poista',
    productsSubtotal: 'Tuotteet',
    discountCode: 'Alennuskoodi',
    discountCodePlaceholder: '6 kirjainta',
    applyDiscountCode: 'Käytä koodi',
    removeDiscountCode: 'Poista koodi',
    discountCodeRequired: 'Syötä alennuskoodi.',
    discountInvalid: 'Alennuskoodi ei ole voimassa.',
    discountNotApplicable: 'Alennuskoodi ei koske ostoskorin tuotteita.',
    discountNeedsApply:
      'Ota syöttämäsi alennuskoodi käyttöön tai poista se ennen jatkamista.',
    discountCheckFailed: 'Alennuskoodin tarkistus epäonnistui.',
    discountApplied: 'Alennuskoodi on käytössä.',
    discountSummary: ({ type, value }) =>
      type === 'percentage'
        ? `Alennus (${value} %)`
        : type === 'free_shipping'
          ? 'Toimitusalennus'
          : 'Alennus',
    continue: 'Jatka',
    back: 'Takaisin',
    deliveryAddress: 'Toimitusosoite',
    streetAddress: 'Katuosoite',
    postcode: 'Postinumero',
    city: 'Postitoimipaikka',
    country: 'Maa',
    countryValue: 'Suomi',
    freePrice: '0 €',
    searchingPickupPoints: 'Haetaan Postin noutopaikkoja...',
    searchPickupPoints: 'Hae Postin noutopaikat',
    selectPickupPoint: 'Valitse Postin noutopaikka',
    pickupPointPlaceholder: 'Valitse noutopaikka listasta',
    estimatedPickupDate: 'Arvioitu noutovalmiuspäivä',
    estimatedDispatchDate: 'Arvioitu lähetyspäivä',
    estimatedDateSuffix:
      'Todellinen lähetys- tai noutopäivä vahvistetaan tilausvahvistuksessa.',
    paymentGeneral:
      'Maksu tapahtuu OP-Kevytyrittäjä-palvelun sähköpostilaskulla. Laskun maksuaika on 7 päivää.',
    paymentAcknowledgement: 'Ymmärrän, että tilaus maksetaan sähköpostilaskulla.',
    invoiceTimingPostal:
      'Lasku lähetetään, kun tilaus on toimitettu Postin kuljetettavaksi.',
    invoiceTimingLocal: 'Lasku lähetetään, kun olet noutanut tilauksen.',
    fields: Object.freeze({
      name: 'Nimi',
      email: 'Sähköposti',
      phone: 'Puhelinnumero',
      message: 'Viesti (valinnainen)',
    }),
    total: 'Yhteensä',
    termsPrefix: 'Lähettämällä tilauksen vahvistat, että olet tutustunut',
    termsLink: 'tilaus- ja toimitusehtoihin',
    privacyLink: 'tietosuojaselosteeseen',
    termsJoiner: 'sekä',
    submitting: 'Lähetetään tilausta...',
    submit: 'Lähetä tilaus',
    deliveryNoticeHeading: 'Toimitus vain Suomeen',
    deliveryNoticeBody:
      'Toimitamme osoitteisiin ja Postin noutopisteisiin Suomessa. Paikallinen nouto on saatavilla Järvenpäässä.',
  }),
  cancellation: Object.freeze({
    requiredError: 'Täytä nimi ja sähköposti.',
    submitFailed: 'Peruuttamisilmoituksen lähetys epäonnistui.',
    submitFailedRetry:
      'Peruuttamisilmoituksen lähetys epäonnistui. Yritä hetken kuluttua uudelleen.',
    successHeading: 'Peruuttamisilmoitus vastaanotettu',
    successBody:
      'Saat automaattisen vahvistuksen sähköpostiisi. Olen erikseen yhteydessä palautus- ja maksujärjestelyistä tilauksen tilanteen ja sisällön mukaan.',
    fields: Object.freeze({
      name: 'Nimi',
      email: 'Sähköposti',
      phone: 'Puhelinnumero (valinnainen)',
      orderReference: 'Tilausnumero (jos tiedossa)',
      orderReferencePlaceholder: 'Esimerkiksi LRM-...',
      contactMethod: 'Toivottu yhteydenottotapa',
      contactEmail: 'Sähköposti',
      phoneCall: 'Puhelu',
      textMessage: 'Tekstiviesti',
      whatsapp: 'WhatsApp-viesti',
      scope: 'Ilmoitus koskee',
      fullScope: 'Koko tilausta',
      partialScope: 'Osaa tilauksesta',
      orderDetails: 'Tilauksen tiedot',
      orderDetailsHint:
        'Kerro omin sanoin tilauksestasi, jotta peruutusilmoitus saadaan kohdennettua oikealle tilaukselle. Jos syötit ylempänä tarkan tilausnumeron, tilauksen muita tietoja ei tarvita.',
    }),
    submitting: 'Lähetetään...',
    submit: 'Vahvista peruuttamisilmoituksen lähetys',
  }),
  dataRequest: Object.freeze({
    genericSuccess:
      'Jos antamasi tiedot vastaavat tilausta, saat sähköpostiisi pian linkin tietojen lataamiseen. Tarkista myös roskapostikansio.',
    requiredError: 'Täytä tilausnumero ja sähköpostiosoite.',
    submitFailed: 'Pyyntöä ei voitu lähettää. Yritä hetken kuluttua uudelleen.',
    successHeading: 'Pyyntö vastaanotettu',
    orderNumber: 'Tilausnumero',
    orderNumberPlaceholder: 'Esim. LRM-260410120000AB',
    email: 'Tilaukseen liitetty sähköpostiosoite',
    submitting: 'Lähetetään...',
    submit: 'Lähetä latauslinkki',
  }),
  download: Object.freeze({
    defaultFilename: 'lieromaa-tilaustiedot.json',
    invalidLink: 'Latauslinkki on virheellinen, käytetty tai vanhentunut.',
    downloadFailed: 'Tietojen lataaminen epäonnistui.',
    checking: 'Tarkistetaan latauslinkkiä...',
    missingLink: 'Latauslinkki puuttuu tai se on jo käytetty.',
    downloading: 'Ladataan...',
    download: 'Lataa tiedot JSON-tiedostona',
  }),
  review: Object.freeze({
    genericError: 'Arvostelun lähetys epäonnistui. Yritä hetken kuluttua uudelleen.',
    missingLinkAddress: 'Arvostelulinkki puuttuu osoitteesta.',
    linkCheckFailed: 'Arvostelulinkin tarkistus epäonnistui.',
    missingLink: 'Arvostelulinkki puuttuu.',
    ratingRequired: 'Valitse tähtiarvio ennen lähetystä.',
    productRequired: 'Valitse vähintään yksi tuote, jota arvostelu koskee.',
    checking: 'Tarkistetaan arvostelulinkkiä...',
    heading: 'Jätä arvostelu',
    orderFallback: 'Tilauksesi',
    testSuccess:
      'Testiarvostelun lähetys onnistui. Testiarvostelua ei tallenneta eikä se estä linkin käyttöä uudelleen.',
    success:
      'Kiitos arvostelusta! Se tallennettiin tarkistettavaksi ja näkyy sivustolla, kun se on tarkastettu roskapostin varalta.',
    nextSteps: 'Seuraavaksi voit jatkaa näistä:',
    gettingStarted: 'Ensimmäiset 30 päivää uudessa matokompostorissa',
    products: 'Matokompostoinnin oppaat',
    ratingLegend: 'Tähtiarvio',
    starLabel: ({ value }) => `${value} / 5 tähteä`,
    testMode: 'Testitilassa lähetystä ei tallenneta eikä linkki vanhene.',
    productLegend: 'Mitä tuotteita arvostelu koskee?',
    productHelp:
      'Valitse tuotteet, joihin arvostelusi liittyy. Tarkistan valinnan vielä ennen julkaisua.',
    writtenLabel: 'Kirjoitettu arvostelu (valinnainen)',
    writtenPlaceholder: 'Millainen kokemus sinulla oli tuotteesta tai toimituksesta?',
    privacyHelp:
      'Älä kirjoita lomakkeelle tunnistettavia henkilötietoja, kuten koko nimeä, osoitetta, sähköpostiosoitetta tai puhelinnumeroa. Käytä näyttönimenä etunimeä tai nimimerkkiä.',
    privateLabel: 'Yksityinen palaute Joonakselle (valinnainen)',
    privatePlaceholder:
      'Jos jokin ei toiminut odotetusti, voit kertoa sen tässä. Tätä kenttää ei julkaista sivustolla.',
    displayNameLabel: 'Näyttönimi (valinnainen)',
    displayNamePlaceholder: 'Esim. Matti tai Nimimerkki',
    moderationHelp:
      'Arvostelu tallennetaan ensin tarkistettavaksi. Se ei näy sivustolla ennen manuaalista hyväksyntää.',
    submitting: 'Lähetetään arvostelua...',
    submit: 'Lähetä arvostelu',
    mismatchEn:
      'Tämä arvostelulinkki kuuluu englanniksi käsiteltyyn tilaukseen. Voit silti lähettää arvostelun tällä sivulla.',
  }),
  orderValidation: Object.freeze({
    validation: 'Tarkista lomakkeen tiedot ja yritä uudelleen.',
    required_field: 'Täytä kaikki pakolliset kentät ennen lähetystä.',
    field_too_long: 'Jokin lomakkeen kentistä on liian pitkä.',
    invalid_email: 'Sähköpostiosoite ei näytä kelvolliselta.',
    cart_invalid: 'Ostoskoria ei voitu lukea. Päivitä sivu ja yritä uudelleen.',
    cart_empty: 'Ostoskori on tyhjä.',
    payment_acknowledgement_required: 'Vahvista maksutapa ennen tilauksen lähettämistä.',
    pickup_point_invalid:
      'Valittu Postin noutopaikka täytyy hakea uudelleen ennen tilauksen lähetystä.',
    too_fast:
      'Lomakkeen lähetys tapahtui liian nopeasti. Odota hetki ja yritä uudelleen.',
    invalid_product:
      'Tilauksen tuotetietoja ei voitu varmistaa. Päivitä sivu ja yritä uudelleen.',
    product_unavailable:
      'Valittu pakkauskoko ei ole tällä hetkellä saatavilla. Päivitä sivu ja yritä uudelleen.',
    invalid_shipping_method: 'Valittu toimitustapa ei ole kelvollinen.',
    invalid_postcode: 'Anna suomalainen 5-numeroinen postinumero.',
    invalid_country: 'Toimitusmaa voi olla vain Suomi.',
    invalid_language: 'Kieli ei ole kelvollinen.',
    cart_validation_failed:
      'Tilauksen tuotetietoja ei voitu varmistaa. Päivitä sivu ja yritä uudelleen.',
    unknown_product: 'Ostoskorissa on tuntematon tuote.',
    prepared_bin_requires_worms:
      'Käyttövalmiin matokompostorin voi tilata vain kompostimatojen kanssa.',
    prepared_bin_limit:
      'Jokaista matopakettia kohden voi tilata enintään yhden käyttövalmiin matokompostorin.',
    small_fibre_mix_requires_worms:
      'Kuituseoksen 150 g pakkauksen voi tilata vain matopaketin lisävalintana.',
    worm_package_limit: 'Tilauksessa on liian monta matopakettia.',
    fibre_mix_limit: 'Tilauksessa on liian monta kuituseosta.',
    invalid_discount_code: 'Alennuskoodi ei ole voimassa.',
    discount_not_applicable: 'Alennuskoodi ei koske ostoskorin tuotteita.',
  }),
});

export default transactionMessages;
