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
    pickup_point_id: '',
    pickup_point_name: '',
    pickup_point_care_of: '',
    pickup_point_street: '',
    pickup_point_postal_code: '',
    pickup_point_city: '',
    pickup_point_municipality: '',
    pickup_point_specific_location: '',
    pickup_point_parcel_locker: '',
    pickup_point_routing_service_code: '',
    pickup_point_distance_meters: '',
    alennuskoodi: '',
    lisatiedot: 'Kiitos.',
  };

  for (const [key, value] of Object.entries({ ...defaults, ...overrides })) {
    formData.set(key, String(value));
  }

  return formData;
}
