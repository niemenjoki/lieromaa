import { PUBLIC_MESSAGE_CODES, createPublicErrorBody } from '@/lib/api/publicLanguage';

// Ylävirran (tilausjärjestelmä, Posti) virhevastausten käsittely julkisille reiteille.
// - 401 ja 403 tarkoittavat väärää palvelintokenia tai asetusta. Asiakas näkee 502:n ja yleisen viestin.
// - 5xx-vastauksen viesti voi kertoa palvelimen sisäisistä asioista. Asiakas näkee yleisen viestin.
// - Muut 4xx-vastaukset ovat asiakkaalle tarkoitettuja validointiviestejä, ja ne välitetään.
// Alkuperäinen tila kirjataan palvelimen lokiin ilman tokenia.

const HIDDEN_UPSTREAM_STATUSES = new Set([401, 403]);

function isClientError(status) {
  return Number.isInteger(status) && status >= 400 && status < 500;
}

// Palauttaa { status, publicData }. publicData on ylävirran JSON-vastaus vain silloin,
// kun sen viestin saa näyttää asiakkaalle. Muuten se on null.
export function resolveUpstreamFailure(upstreamResponse, responseData, { label } = {}) {
  const upstreamStatus = Number(upstreamResponse?.status) || 0;
  const logLabel = label || 'Upstream request';

  if (HIDDEN_UPSTREAM_STATUSES.has(upstreamStatus)) {
    console.error(
      `${logLabel} was rejected by the upstream service with status ${upstreamStatus}.`
    );
    return { status: 502, publicData: null };
  }

  if (isClientError(upstreamStatus) && responseData && typeof responseData === 'object') {
    return { status: upstreamStatus, publicData: responseData };
  }

  console.error(
    `${logLabel} failed upstream with status ${upstreamStatus || 'unknown'}${
      responseData ? '' : ' and a non-JSON body'
    }${responseData?.code ? ` (code ${String(responseData.code).slice(0, 80)})` : ''}.`
  );

  return {
    status: upstreamStatus >= 500 && upstreamStatus <= 599 ? upstreamStatus : 502,
    publicData: null,
  };
}

// Julkinen virherunko { ok: false, code, message }. fallbackCode on koodi 4xx-vastaukselle,
// jossa ylävirta ei kerro koodia.
export function createUpstreamErrorBody(
  failure,
  language,
  fallbackCode = PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE
) {
  if (!failure?.publicData) {
    return createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language);
  }

  return createPublicErrorBody(
    failure.publicData.code || fallbackCode,
    language,
    failure.publicData.message || undefined
  );
}

export function createUpstreamErrorResponse(
  upstreamResponse,
  responseData,
  language,
  { label, fallbackCode, headers } = {}
) {
  const failure = resolveUpstreamFailure(upstreamResponse, responseData, { label });
  return Response.json(createUpstreamErrorBody(failure, language, fallbackCode), {
    status: failure.status,
    ...(headers ? { headers } : {}),
  });
}

// Tila, jonka asiakas näkee ylävirran virheestä, kun virheviesti on aina yleinen.
export function getPublicUpstreamStatus(upstreamStatus) {
  const status = Number(upstreamStatus) || 0;
  if (!status || HIDDEN_UPSTREAM_STATUSES.has(status) || status < 400 || status > 599) {
    return 502;
  }
  return status;
}
