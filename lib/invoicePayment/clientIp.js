// Asiakkaan IP-osoite tilausjärjestelmälle väärien maksukoodien rajaamista varten. Sivusto on Cloudflaren takana,
// joten x-real-ip ja x-forwarded-for ovat Cloudflaren reunapalvelimen osoitteita; asiakkaan osoite on
// cf-connecting-ip-otsakkeessa.
export function getClientIp(request) {
  const forwarded = String(request.headers.get('x-forwarded-for') || '')
    .split(',')[0]
    .trim();
  return String(
    request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      forwarded ||
      'unknown'
  ).slice(0, 100);
}
