import { ORDER_ERROR_MESSAGE, ORDER_SUBMIT_ENDPOINT } from '@/lib/copy/orderMessages';

export function isOrderServiceUnavailable(error) {
  return (
    ['upstream_unavailable', 'request_failed', 'invalid_response'].includes(
      error?.code
    ) || [408, 502, 503, 504].includes(error?.status)
  );
}

export async function submitOrderForm(formElement, { language = 'fi' } = {}) {
  const request = {
    method: 'POST',
    body: new FormData(formElement),
    headers: {
      Accept: 'application/json',
      'X-Lieromaa-Language': language,
    },
  };
  let response;
  try {
    response = await fetch(ORDER_SUBMIT_ENDPOINT, request);
  } catch (cause) {
    const error = new Error(ORDER_ERROR_MESSAGE, { cause });
    error.code = 'request_failed';
    throw error;
  }

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.ok) {
    const error = new Error(data?.message || ORDER_ERROR_MESSAGE);
    error.code = data?.code || (response.ok && !data ? 'invalid_response' : '');
    error.status = response.status;
    throw error;
  }

  return data;
}
