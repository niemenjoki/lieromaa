'use client';

import { useEffect, useSyncExternalStore } from 'react';

import { usePathname } from 'next/navigation';

import { ANALYTICS_CUSTOM_EVENT_NAME } from '@/lib/analytics/events';
import { toLookuEvent } from '@/lib/analytics/lookuEvents.mjs';
import {
  ANALYTICS_OPT_OUT_PATH,
  ANALYTICS_OPT_OUT_STORAGE_KEY,
  ANALYTICS_OPT_OUT_STORAGE_VALUE,
  clearStoredAnalyticsState,
} from '@/lib/analytics/optOut';
import { event, start, stop } from '@/lib/looku/browser';

const LOOKU_COLLECT_ENDPOINT = '/api/looku';
const ANALYTICS_CONSENT_EVENT_NAME = 'lieromaa:analytics-consent-changed';

function isAnalyticsOptedOut() {
  try {
    return (
      globalThis.localStorage?.getItem(ANALYTICS_OPT_OUT_STORAGE_KEY) ===
      ANALYTICS_OPT_OUT_STORAGE_VALUE
    );
  } catch {
    return false;
  }
}

function hasAnalyticsConsent() {
  return Boolean(globalThis.window?.__lieromaaAnalyticsConsentGranted);
}

function subscribeToAnalyticsConsent(onChange) {
  globalThis.addEventListener(ANALYTICS_CONSENT_EVENT_NAME, onChange);
  return () => globalThis.removeEventListener(ANALYTICS_CONSENT_EVENT_NAME, onChange);
}

function getServerAnalyticsConsent() {
  return false;
}

function sendEvent(detail) {
  const lookuEvent = toLookuEvent(detail);
  if (lookuEvent) {
    event(lookuEvent.name, lookuEvent.options);
  }
}

function getTrackedFormId(formElement) {
  return String(formElement?.dataset?.analyticsForm || '')
    .trim()
    .slice(0, 60);
}

function isTrackableField(target) {
  if (!(target instanceof HTMLElement) || !target.closest('form[data-analytics-form]')) {
    return false;
  }

  if (
    target instanceof HTMLInputElement &&
    ['hidden', 'submit', 'button', 'reset'].includes(target.type)
  ) {
    return false;
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

function readCartItemsFromForm(formElement) {
  const rawValue = formElement?.elements?.cart_items_json?.value || '';
  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return [];
  }
}

// Page views are counted on the server. With analytics consent, Looku's browser
// collector adds reading time, scroll depth and the site's named events. It keeps
// everything in memory and the site's own route forwards the data to Looku without
// the IP address, so nothing is stored in the browser.
export default function LookuAnalytics() {
  const pathname = usePathname();
  const analyticsConsentGranted = useSyncExternalStore(
    subscribeToAnalyticsConsent,
    hasAnalyticsConsent,
    getServerAnalyticsConsent
  );
  const tracking =
    analyticsConsentGranted &&
    pathname !== ANALYTICS_OPT_OUT_PATH &&
    !isAnalyticsOptedOut();

  useEffect(() => {
    // Remove identifiers that older versions stored in the browser.
    clearStoredAnalyticsState();
  }, []);

  useEffect(() => {
    if (!tracking) {
      return undefined;
    }

    start({ endpoint: LOOKU_COLLECT_ENDPOINT });

    // Forms are counted once per page view: the first edit and the submit.
    const startedForms = new Set();
    let formPath = globalThis.location.pathname;

    function handleTrackedInput(inputEvent) {
      if (!isTrackableField(inputEvent.target)) {
        return;
      }

      const formId = getTrackedFormId(
        inputEvent.target.closest('form[data-analytics-form]')
      );
      if (formPath !== globalThis.location.pathname) {
        startedForms.clear();
        formPath = globalThis.location.pathname;
      }
      if (formId && !startedForms.has(formId)) {
        startedForms.add(formId);
        sendEvent({ eventName: 'form_start', eventTarget: formId });
      }
    }

    function handleTrackedSubmit(submitEvent) {
      const formId = getTrackedFormId(submitEvent.target);
      if (!formId) {
        return;
      }

      sendEvent({
        eventName: formId === 'order' ? 'order_submit_attempt' : 'form_submit',
        eventTarget: formId,
        eventItems: formId === 'order' ? readCartItemsFromForm(submitEvent.target) : [],
      });
    }

    function handleTrackedClick(clickEvent) {
      const button = clickEvent.target?.closest?.('[data-analytics-cta]');
      if (!button || String(button.dataset.analyticsCta || '').trim() !== 'order') {
        return;
      }

      sendEvent({
        eventName: 'cta_click',
        eventTarget: 'order',
        eventValue:
          button.getAttribute('href') || button.getAttribute('aria-label') || '',
      });
    }

    function handleCustomAnalyticsEvent(customEvent) {
      sendEvent(customEvent.detail || {});
    }

    document.addEventListener('input', handleTrackedInput, true);
    document.addEventListener('change', handleTrackedInput, true);
    document.addEventListener('submit', handleTrackedSubmit, true);
    document.addEventListener('click', handleTrackedClick, true);
    globalThis.addEventListener(ANALYTICS_CUSTOM_EVENT_NAME, handleCustomAnalyticsEvent);

    return () => {
      document.removeEventListener('input', handleTrackedInput, true);
      document.removeEventListener('change', handleTrackedInput, true);
      document.removeEventListener('submit', handleTrackedSubmit, true);
      document.removeEventListener('click', handleTrackedClick, true);
      globalThis.removeEventListener(
        ANALYTICS_CUSTOM_EVENT_NAME,
        handleCustomAnalyticsEvent
      );
      // Ends the current measurement, for example when consent is withdrawn.
      stop();
    };
  }, [tracking]);

  useEffect(() => {
    if (tracking && pathname === '/tilaus') {
      sendEvent({ eventName: 'checkout_view' });
    }
  }, [tracking, pathname]);

  return null;
}
