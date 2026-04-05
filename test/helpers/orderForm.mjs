export function createValidOrderFormData(overrides = {}) {
  const formData = new FormData();
  const defaults = {
    _gotcha: '',
    tuote: 'Kompostimadot (Eisenia fetida)',
    tuote_avain: 'worms',
    sku: 'worms-100',
    toimitus: 'nouto',
    lomake_aloitettu_ms: '1700000000000',
    submission_id: 'submission-123',
    sivu_polku: '/tuotteet/madot',
    nimi: 'Testi Asiakas',
    email: 'testi@example.com',
    phone: '0401234567',
    osoite: '',
    postinumero: '',
    toimipaikka: '',
    alennuskoodi: '',
    lisatiedot: 'Kiitos.',
  };

  for (const [key, value] of Object.entries({ ...defaults, ...overrides })) {
    formData.set(key, String(value));
  }

  return formData;
}
