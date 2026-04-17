import { getFallbackFormScenario } from './orderScenarios.mjs';

export function createValidOrderFormData(overrides = {}) {
  const formData = new FormData();
  const scenario = getFallbackFormScenario(overrides);
  const defaults = {
    _gotcha: '',
    tuote: scenario.product?.productName || scenario.product?.name || 'Tuote',
    tuote_avain: scenario.productKey || '',
    sku: scenario.variant?.sku || '',
    toimitus: scenario.shippingOption?.id || '',
    lomake_aloitettu_ms: '1700000000000',
    submission_id: 'submission-123',
    sivu_polku: scenario.product?.canonicalUrl || '/',
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

export function createValidOrderFormDataForScenario(scenario, overrides = {}) {
  const addressDefaults =
    scenario.fulfillmentType === 'pickup_point' || scenario.fulfillmentType === 'home_delivery'
      ? {
          osoite: 'Kompostikuja 1',
          postinumero: '00100',
          toimipaikka: 'Helsinki',
        }
      : {
          osoite: '',
          postinumero: '',
          toimipaikka: '',
        };
  const pickupPointDefaults =
    scenario.fulfillmentType === 'pickup_point'
      ? {
          pickup_point_id: 'POSTI-001',
          pickup_point_name: 'Posti Pasila',
          pickup_point_care_of: '',
          pickup_point_street: 'Ratapihantie 6',
          pickup_point_postal_code: '00520',
          pickup_point_city: 'Helsinki',
          pickup_point_municipality: 'Helsinki',
          pickup_point_specific_location: '1. kerros',
          pickup_point_parcel_locker: 'true',
          pickup_point_routing_service_code: '3198',
          pickup_point_distance_meters: '450',
        }
      : {};

  return createValidOrderFormData({
    tuote: scenario.product?.productName || scenario.product?.name || 'Tuote',
    tuote_avain: scenario.productKey,
    sku: scenario.variant?.sku || '',
    toimitus: scenario.shippingOption?.id || '',
    sivu_polku: scenario.product?.canonicalUrl || '/',
    ...addressDefaults,
    ...pickupPointDefaults,
    ...overrides,
  });
}
