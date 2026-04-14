import { ORDER_ERROR_MESSAGE, ORDER_SUBMIT_ENDPOINT } from '@/lib/copy/orderMessages';

export async function submitOrderForm(formElement) {
  const response = await fetch(ORDER_SUBMIT_ENDPOINT, {
    method: 'POST',
    body: new FormData(formElement),
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.ok) {
    throw new Error(data?.message || ORDER_ERROR_MESSAGE);
  }

  return data;
}
