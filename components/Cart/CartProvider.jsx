'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { getCartLineItems, normalizeCartItems } from '@/lib/orders/cartOrder';

const CART_STORAGE_KEY = 'lieromaaCartV1';
const CART_MAX_IDLE_MS = 7 * 24 * 60 * 60 * 1000;
const CartContext = createContext(null);

function normalizeTimestamp(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
}

function readStoredCart() {
  try {
    const rawValue = localStorage.getItem(CART_STORAGE_KEY);
    if (!rawValue) {
      return { items: [], lastEditedAt: null };
    }

    const parsed = JSON.parse(rawValue);
    const isLegacyCart = Array.isArray(parsed);
    const items = normalizeCartItems(isLegacyCart ? parsed : parsed?.items);

    if (!items.length) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return { items: [], lastEditedAt: null };
    }

    const lastEditedAt =
      normalizeTimestamp(isLegacyCart ? null : parsed?.lastEditedAt) ?? Date.now();

    if (Date.now() - lastEditedAt > CART_MAX_IDLE_MS) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return { items: [], lastEditedAt: null };
    }

    writeStoredCart(items, { lastEditedAt });

    return { items, lastEditedAt };
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return { items: [], lastEditedAt: null };
  }
}

function writeStoredCart(items, { lastEditedAt = Date.now() } = {}) {
  const normalizedItems = normalizeCartItems(items);

  if (!normalizedItems.length) {
    localStorage.removeItem(CART_STORAGE_KEY);
    return null;
  }

  const normalizedTimestamp = normalizeTimestamp(lastEditedAt) ?? Date.now();
  localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify({
      items: normalizedItems,
      lastEditedAt: normalizedTimestamp,
    })
  );

  return normalizedTimestamp;
}

function createResult(ok, message = '') {
  return {
    ok,
    message,
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [lastEditedAt, setLastEditedAt] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedCart = readStoredCart();
    setItems(storedCart.items);
    setLastEditedAt(storedCart.lastEditedAt);
    setIsHydrated(true);

    const handleStorage = (event) => {
      if (event.key === CART_STORAGE_KEY) {
        const nextStoredCart = readStoredCart();
        setItems(nextStoredCart.items);
        setLastEditedAt(nextStoredCart.lastEditedAt);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const commitItems = (nextItems) => {
    const normalizedItems = normalizeCartItems(nextItems);

    try {
      getCartLineItems(normalizedItems);
    } catch (error) {
      return createResult(
        false,
        error instanceof Error ? error.message : 'Korin päivittäminen epäonnistui.'
      );
    }

    setItems(normalizedItems);
    setLastEditedAt(writeStoredCart(normalizedItems));
    return createResult(true);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const addItems = (nextItems) => {
    const mergedItems = [...items, ...normalizeCartItems(nextItems)];
    return commitItems(mergedItems);
  };
  const value = {
    items,
    itemCount,
    isHydrated,
    lastEditedAt,
    expiresAt: lastEditedAt ? lastEditedAt + CART_MAX_IDLE_MS : null,
    addItems,
    addItem(sku, quantity = 1) {
      return addItems([{ sku, quantity }]);
    },
    setItemQuantity(sku, quantity) {
      const normalizedSku = String(sku || '').trim();
      const nextQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
      const nextItems = items.map((item) =>
        item.sku === normalizedSku ? { ...item, quantity: nextQuantity } : item
      );

      return commitItems(nextItems);
    },
    removeItem(sku) {
      const normalizedSku = String(sku || '').trim();
      return commitItems(items.filter((item) => item.sku !== normalizedSku));
    },
    clearCart() {
      setItems([]);
      setLastEditedAt(null);
      writeStoredCart([]);
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error('useCart must be used within CartProvider.');
  }

  return value;
}
