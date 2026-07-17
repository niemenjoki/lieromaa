import { assertLanguage } from './config.mjs';
import { getCommonMessages } from './messages.mjs';

export const PUBLIC_MESSAGE_CODES = Object.freeze({
  INVALID_REQUEST: 'invalid_request',
  SAME_ORIGIN_REQUIRED: 'same_origin_required',
  UPSTREAM_UNAVAILABLE: 'upstream_unavailable',
  UNKNOWN_ERROR: 'unknown_error',
});

const MESSAGE_KEYS_BY_CODE = Object.freeze({
  [PUBLIC_MESSAGE_CODES.INVALID_REQUEST]: 'invalidRequest',
  [PUBLIC_MESSAGE_CODES.SAME_ORIGIN_REQUIRED]: 'sameOriginRequired',
  [PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE]: 'upstreamUnavailable',
  [PUBLIC_MESSAGE_CODES.UNKNOWN_ERROR]: 'unknownError',
});

export function getPublicMessage(code, language) {
  const normalizedLanguage = assertLanguage(language);
  const messageKey = MESSAGE_KEYS_BY_CODE[code];
  if (!messageKey) {
    throw new Error(`Unknown public message code "${String(code)}".`);
  }

  return getCommonMessages(normalizedLanguage).publicMessages[messageKey];
}
