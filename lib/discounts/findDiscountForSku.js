'use client';

import { resolveDiscountForSku } from '@/lib/discounts/resolveDiscountForSku';

export async function findDiscountForSku({ code, sku }) {
  return resolveDiscountForSku({ code, sku });
}
