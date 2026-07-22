export function openConsentPreferences() {
  try {
    const openPreferences = globalThis.window?.__lieromaaOpenConsentPreferences;
    return typeof openPreferences === 'function' ? openPreferences() : false;
  } catch {
    return false;
  }
}
