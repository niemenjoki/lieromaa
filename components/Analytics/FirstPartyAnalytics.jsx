'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

import { usePathname } from 'next/navigation';

import { ANALYTICS_CUSTOM_EVENT_NAME } from '@/lib/analytics/events';
import {
  ANALYTICS_OPT_OUT_PATH,
  ANALYTICS_OPT_OUT_STORAGE_KEY,
  ANALYTICS_OPT_OUT_STORAGE_VALUE,
  clearStoredAnalyticsState,
} from '@/lib/analytics/optOut';

const ANALYTICS_ENDPOINT = '/api/analytics';
const ANALYTICS_SCHEMA_VERSION = 2;
const ANALYTICS_CONSENT_EVENT_NAME = 'lieromaa:analytics-consent-changed';
const IGNORED_ANALYTICS_PATHS = new Set([ANALYTICS_OPT_OUT_PATH]);
const UTM_FIELDS = ['utmSource', 'utmMedium', 'utmCampaign', 'utmContent', 'utmTerm'];
const UTM_QUERY_KEYS = {
  utmSource: 'utm_source',
  utmMedium: 'utm_medium',
  utmCampaign: 'utm_campaign',
  utmContent: 'utm_content',
  utmTerm: 'utm_term',
};

function createId(prefix) {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
  );
}

function getStorage(type) {
  try {
    return globalThis[type] || null;
  } catch {
    return null;
  }
}

function isAnalyticsOptedOut() {
  const storage = getStorage('localStorage');
  return (
    storage?.getItem(ANALYTICS_OPT_OUT_STORAGE_KEY) === ANALYTICS_OPT_OUT_STORAGE_VALUE
  );
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

function normalizePath(value) {
  const baseValue = String(value || '/').trim();
  const withoutHash = baseValue.split('#')[0] || '/';
  const withoutQuery = withoutHash.split('?')[0] || '/';
  const normalized = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;

  return normalized.length > 200 ? normalized.slice(0, 200) : normalized;
}

function isIgnoredAnalyticsPath(value) {
  return IGNORED_ANALYTICS_PATHS.has(normalizePath(value));
}

function normalizeCampaignValue(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

function emptyCampaignParams() {
  return Object.fromEntries(UTM_FIELDS.map((fieldName) => [fieldName, '']));
}

function getCurrentCampaignParams() {
  const campaign = emptyCampaignParams();
  let searchParams;

  try {
    searchParams = new URLSearchParams(globalThis.location?.search || '');
  } catch {
    return campaign;
  }

  for (const fieldName of UTM_FIELDS) {
    campaign[fieldName] = normalizeCampaignValue(
      searchParams.get(UTM_QUERY_KEYS[fieldName])
    );
  }

  return campaign;
}

function hasCampaignParams(campaign) {
  return UTM_FIELDS.some((fieldName) => Boolean(campaign?.[fieldName]));
}

// Visits are counted on the server. This script runs only with analytics
// consent and keeps everything in memory: nothing is stored in the browser.
let tabCampaign = null;

function getTabCampaign() {
  const currentCampaign = getCurrentCampaignParams();
  if (!tabCampaign || hasCampaignParams(currentCampaign)) {
    tabCampaign = currentCampaign;
  }

  return tabCampaign;
}

function getCurrentScrollDepth() {
  const documentElement = document.documentElement;
  const scrollHeight = Math.max(
    documentElement.scrollHeight,
    document.body?.scrollHeight || 0
  );
  const viewportHeight = globalThis.innerHeight || 0;
  const maxScrollable = scrollHeight - viewportHeight;

  if (maxScrollable <= 0) {
    return 100;
  }

  const currentDepth = ((globalThis.scrollY + viewportHeight) / scrollHeight) * 100;
  return Math.max(0, Math.min(100, currentDepth));
}

function getTrackedFormId(formElement) {
  if (!formElement) {
    return '';
  }

  const trackedFormId = String(formElement.dataset.analyticsForm || '').trim();
  return trackedFormId.slice(0, 60);
}

function isTrackableField(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (!target.closest('form[data-analytics-form]')) {
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

function pauseView(view) {
  if (!view?.visibleStartedAtMs) {
    return;
  }

  view.accumulatedVisibleMs += Math.max(0, Date.now() - view.visibleStartedAtMs);
  view.visibleStartedAtMs = 0;
}

function resumeView(view) {
  if (!view || view.visibleStartedAtMs) {
    return;
  }

  view.visibleStartedAtMs = Date.now();
}

function getDwellMs(view, now = Date.now()) {
  const activeVisibleMs = view.visibleStartedAtMs
    ? Math.max(0, now - view.visibleStartedAtMs)
    : 0;

  return view.accumulatedVisibleMs + activeVisibleMs;
}

function buildPayload(view, now = Date.now()) {
  return {
    schemaVersion: ANALYTICS_SCHEMA_VERSION,
    pageViewId: view.pageViewId,
    path: view.path,
    startedAt: new Date(view.startedAtMs).toISOString(),
    endedAt: new Date(now).toISOString(),
    dwellMs: Math.max(0, Math.round(getDwellMs(view, now))),
    maxScrollPercent: Number(Math.min(100, view.maxScrollPercent).toFixed(2)),
    formStartCount: view.startedForms.size,
    formSubmitCount: view.submittedForms.size,
    orderClickCount: view.orderClickCount,
  };
}

function sendAnalyticsPayload(payload) {
  if (!payload) {
    return;
  }

  const body = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon(ANALYTICS_ENDPOINT, blob)) {
        return;
      }
    }

    fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
      cache: 'no-store',
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

function normalizeEventItems(value) {
  const sourceItems = Array.isArray(value) ? value : [];
  return sourceItems
    .map((item) => ({
      sku: String(item?.sku || '')
        .trim()
        .slice(0, 80),
      quantity: Math.max(1, Math.min(100, Math.round(Number(item?.quantity) || 1))),
    }))
    .filter((item) => item.sku)
    .slice(0, 20);
}

function readCartItemsFromForm(formElement) {
  if (!(formElement instanceof HTMLFormElement)) {
    return [];
  }

  const rawValue = formElement.elements?.cart_items_json?.value || '';
  if (!rawValue) {
    return [];
  }

  try {
    return normalizeEventItems(JSON.parse(rawValue));
  } catch {
    return [];
  }
}

function buildEventPayload(view, eventDetail = {}) {
  const { eventName, eventTarget = '', eventValue = '', eventItems = [] } = eventDetail;
  if (!view || !eventName) {
    return null;
  }

  return {
    schemaVersion: ANALYTICS_SCHEMA_VERSION,
    eventId: createId('event'),
    pageViewId: view.pageViewId,
    path: view.path,
    eventName: String(eventName || '')
      .trim()
      .slice(0, 80),
    eventTarget: String(eventTarget || '')
      .trim()
      .slice(0, 120),
    eventValue: String(eventValue || '')
      .trim()
      .slice(0, 120),
    eventItems: normalizeEventItems(eventItems),
    ...view.campaign,
    occurredAt: new Date().toISOString(),
  };
}

function sendEvent(view, eventDetail) {
  const payload = buildEventPayload(view, eventDetail);
  if (payload) {
    sendAnalyticsPayload(payload);
  }
}

function createPageView(path) {
  return {
    pageViewId: createId('pageview'),
    path: normalizePath(path),
    campaign: { ...getTabCampaign() },
    startedAtMs: Date.now(),
    visibleStartedAtMs: document.visibilityState === 'hidden' ? 0 : Date.now(),
    accumulatedVisibleMs: 0,
    maxScrollPercent: getCurrentScrollDepth(),
    startedForms: new Set(),
    submittedForms: new Set(),
    orderClickCount: 0,
  };
}

export default function FirstPartyAnalytics() {
  const pathname = usePathname();
  const currentViewRef = useRef(null);
  // The consent gate sets the window flag before it emits the change event.
  const analyticsConsentGranted = useSyncExternalStore(
    subscribeToAnalyticsConsent,
    hasAnalyticsConsent,
    getServerAnalyticsConsent
  );

  useEffect(() => {
    // Remove identifiers that older versions stored in the browser.
    clearStoredAnalyticsState();

    function handleAnalyticsConsentChange(event) {
      if (!event.detail?.granted) {
        currentViewRef.current = null;
      }
    }

    globalThis.addEventListener(
      ANALYTICS_CONSENT_EVENT_NAME,
      handleAnalyticsConsentChange
    );

    return () => {
      globalThis.removeEventListener(
        ANALYTICS_CONSENT_EVENT_NAME,
        handleAnalyticsConsentChange
      );
    };
  }, []);

  useEffect(() => {
    if (!analyticsConsentGranted) {
      currentViewRef.current = null;
      return;
    }

    const nextPath = normalizePath(pathname || '/');
    const currentView = currentViewRef.current;
    const shouldSkipTracking = isIgnoredAnalyticsPath(nextPath) || isAnalyticsOptedOut();

    if (shouldSkipTracking) {
      currentViewRef.current = null;
      return;
    }

    if (currentView?.path === nextPath) {
      return;
    }

    if (currentView) {
      currentView.maxScrollPercent = Math.max(
        currentView.maxScrollPercent,
        getCurrentScrollDepth()
      );
      pauseView(currentView);
      sendAnalyticsPayload(buildPayload(currentView));
    }

    const nextView = createPageView(nextPath);
    currentViewRef.current = nextView;
    sendAnalyticsPayload(buildPayload(nextView, nextView.startedAtMs));
    if (nextView.path === '/tilaus') {
      sendEvent(nextView, { eventName: 'checkout_view' });
    }
  }, [analyticsConsentGranted, pathname]);

  useEffect(() => {
    if (!analyticsConsentGranted) {
      return undefined;
    }

    function sendCurrentSnapshot() {
      const currentView = currentViewRef.current;
      if (!currentView) {
        return;
      }

      currentView.maxScrollPercent = Math.max(
        currentView.maxScrollPercent,
        getCurrentScrollDepth()
      );
      sendAnalyticsPayload(buildPayload(currentView));
    }

    function handleScroll() {
      const currentView = currentViewRef.current;
      if (!currentView) {
        return;
      }

      currentView.maxScrollPercent = Math.max(
        currentView.maxScrollPercent,
        getCurrentScrollDepth()
      );
    }

    function handleVisibilityChange() {
      const currentView = currentViewRef.current;
      if (!currentView) {
        return;
      }

      if (document.visibilityState === 'hidden') {
        currentView.maxScrollPercent = Math.max(
          currentView.maxScrollPercent,
          getCurrentScrollDepth()
        );
        pauseView(currentView);
        sendCurrentSnapshot();
        return;
      }

      resumeView(currentView);
    }

    function handlePageHide() {
      const currentView = currentViewRef.current;
      if (!currentView) {
        return;
      }

      currentView.maxScrollPercent = Math.max(
        currentView.maxScrollPercent,
        getCurrentScrollDepth()
      );
      pauseView(currentView);
      sendCurrentSnapshot();
    }

    function handleTrackedInput(event) {
      if (!isTrackableField(event.target)) {
        return;
      }

      const currentView = currentViewRef.current;
      const formId = getTrackedFormId(event.target.closest('form[data-analytics-form]'));
      if (!currentView || !formId) {
        return;
      }

      if (!currentView.startedForms.has(formId)) {
        currentView.startedForms.add(formId);
        sendEvent(currentView, {
          eventName: 'form_start',
          eventTarget: formId,
        });
        sendCurrentSnapshot();
      }
    }

    function handleTrackedSubmit(event) {
      const currentView = currentViewRef.current;
      const formId = getTrackedFormId(event.target);
      if (!currentView || !formId) {
        return;
      }

      currentView.startedForms.add(formId);
      currentView.submittedForms.add(formId);
      sendEvent(currentView, {
        eventName: formId === 'order' ? 'order_submit_attempt' : 'form_submit',
        eventTarget: formId,
        eventItems: formId === 'order' ? readCartItemsFromForm(event.target) : [],
      });
      sendCurrentSnapshot();
    }

    function handleTrackedClick(event) {
      const currentView = currentViewRef.current;
      const button = event.target?.closest?.('[data-analytics-cta]');
      if (!currentView || !button) {
        return;
      }

      if (String(button.dataset.analyticsCta || '').trim() !== 'order') {
        return;
      }

      currentView.orderClickCount += 1;
      sendEvent(currentView, {
        eventName: 'cta_click',
        eventTarget: String(button.dataset.analyticsCta || '').trim(),
        eventValue:
          button.getAttribute('href') || button.getAttribute('aria-label') || '',
      });
      sendCurrentSnapshot();
    }

    function handleCustomAnalyticsEvent(event) {
      const currentView = currentViewRef.current;
      if (!currentView) {
        return;
      }

      sendEvent(currentView, event.detail || {});
    }

    globalThis.addEventListener('scroll', handleScroll, { passive: true });
    globalThis.addEventListener('pagehide', handlePageHide);
    globalThis.addEventListener('beforeunload', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('input', handleTrackedInput, true);
    document.addEventListener('change', handleTrackedInput, true);
    document.addEventListener('submit', handleTrackedSubmit, true);
    document.addEventListener('click', handleTrackedClick, true);
    globalThis.addEventListener(ANALYTICS_CUSTOM_EVENT_NAME, handleCustomAnalyticsEvent);

    return () => {
      globalThis.removeEventListener('scroll', handleScroll);
      globalThis.removeEventListener('pagehide', handlePageHide);
      globalThis.removeEventListener('beforeunload', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('input', handleTrackedInput, true);
      document.removeEventListener('change', handleTrackedInput, true);
      document.removeEventListener('submit', handleTrackedSubmit, true);
      document.removeEventListener('click', handleTrackedClick, true);
      globalThis.removeEventListener(
        ANALYTICS_CUSTOM_EVENT_NAME,
        handleCustomAnalyticsEvent
      );

      const currentView = currentViewRef.current;
      if (currentView && hasAnalyticsConsent() && !isAnalyticsOptedOut()) {
        currentView.maxScrollPercent = Math.max(
          currentView.maxScrollPercent,
          getCurrentScrollDepth()
        );
        pauseView(currentView);
        sendAnalyticsPayload(buildPayload(currentView));
      }
    };
  }, [analyticsConsentGranted]);

  return null;
}
