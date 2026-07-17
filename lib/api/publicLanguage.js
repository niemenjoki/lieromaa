import { normalizeLanguage } from '@/lib/i18n/config.mjs';
import { PUBLIC_MESSAGE_CODES, getPublicMessage } from '@/lib/i18n/publicMessages.mjs';

export const LIEROMAA_LANGUAGE_HEADER = 'X-Lieromaa-Language';

export function getPublicRequestLanguage(request) {
  try {
    return normalizeLanguage(request?.headers?.get?.(LIEROMAA_LANGUAGE_HEADER));
  } catch {
    return 'fi';
  }
}

export function createPublicErrorBody(code, language, message) {
  const publicCode = code || PUBLIC_MESSAGE_CODES.UNKNOWN_ERROR;
  let resolvedMessage = message;
  if (!resolvedMessage) {
    try {
      resolvedMessage = getPublicMessage(publicCode, language);
    } catch {
      resolvedMessage = getPublicMessage(PUBLIC_MESSAGE_CODES.UNKNOWN_ERROR, language);
    }
  }

  return {
    ok: false,
    code: publicCode,
    message: resolvedMessage,
  };
}

export { PUBLIC_MESSAGE_CODES };
