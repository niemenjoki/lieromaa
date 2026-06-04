'use client';

import { useEffect, useRef, useState } from 'react';

import { usePathname } from 'next/navigation';

import { ANALYTICS_CUSTOM_EVENT_NAME } from '@/lib/analytics/events';
import {
  ANALYTICS_OPT_OUT_PATH,
  ANALYTICS_OPT_OUT_STORAGE_KEY,
  ANALYTICS_OPT_OUT_STORAGE_VALUE,
  ANALYTICS_SESSION_STORAGE_KEY,
  ANALYTICS_VISITOR_STORAGE_KEY,
  clearStoredAnalyticsState,
} from '@/lib/analytics/optOut';

const ANALYTICS_ENDPOINT = '/api/analytics';
const ANALYTICS_SCHEMA_VERSION = 2;
const ANALYTICS_CONSENT_EVENT_NAME = 'lieromaa:analytics-consent-changed';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_TOUCH_INTERVAL_MS = 60 * 1000;
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

function normalizeHost(value) {
  const plainValue = String(value || '').trim();
  if (!plainValue) {
    return '';
  }

  try {
    const parsed = new URL(plainValue);
    return parsed.host
      .toLowerCase()
      .replace(/^www\./, '')
      .slice(0, 120);
  } catch {
    const sanitized = plainValue
      .replace(/^[a-z]+:\/\//i, '')
      .split('/')[0]
      .toLowerCase()
      .replace(/^www\./, '');

    return sanitized.slice(0, 120);
  }
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

function getExternalReferrerHost() {
  const referrerHost = normalizeHost(document.referrer || '');
  const currentHost = normalizeHost(globalThis.location?.host || '');

  if (!referrerHost || !currentHost || referrerHost === currentHost) {
    return '';
  }

  return referrerHost;
}

function getOrCreateVisitorId() {
  const storage = getStorage('localStorage');
  const existingId = storage?.getItem(ANALYTICS_VISITOR_STORAGE_KEY);
  if (existingId) {
    return existingId;
  }

  const nextId = createId('visitor');
  storage?.setItem(ANALYTICS_VISITOR_STORAGE_KEY, nextId);
  return nextId;
}

function loadSessionState(currentPath) {
  const storage = getStorage('sessionStorage');
  const now = Date.now();
  const currentCampaign = getCurrentCampaignParams();
  let session = null;

  if (storage) {
    try {
      session = JSON.parse(storage.getItem(ANALYTICS_SESSION_STORAGE_KEY) || 'null');
    } catch {
      session = null;
    }
  }

  const isExpired =
    !session ||
    !session.id ||
    Number(session.lastActivityAt || 0) + SESSION_TIMEOUT_MS < now;

  if (isExpired) {
    session = {
      id: createId('session'),
      pageCount: 0,
      lastPath: '',
      lastActivityAt: now,
      referrerHost: getExternalReferrerHost(),
      campaign: currentCampaign,
    };
  }

  if (hasCampaignParams(currentCampaign)) {
    session.campaign = currentCampaign;
  } else {
    session.campaign = {
      ...emptyCampaignParams(),
      ...(session.campaign || {}),
    };
  }

  const previousPath =
    session.lastPath && session.lastPath !== currentPath ? session.lastPath : '';

  session.pageCount = Number(session.pageCount || 0) + 1;
  session.lastPath = currentPath;
  session.lastActivityAt = now;

  storage?.setItem(ANALYTICS_SESSION_STORAGE_KEY, JSON.stringify(session));

  return {
    sessionId: session.id,
    sessionPageIndex: session.pageCount,
    previousPath,
    referrerHost: String(session.referrerHost || ''),
    campaign: session.campaign,
  };
}

function touchSession(path, lastTouchedAtRef) {
  const now = Date.now();
  if (
    lastTouchedAtRef.current &&
    now - lastTouchedAtRef.current < SESSION_TOUCH_INTERVAL_MS
  ) {
    return;
  }

  lastTouchedAtRef.current = now;

  const storage = getStorage('sessionStorage');
  if (!storage) {
    return;
  }

  try {
    const session = JSON.parse(
      storage.getItem(ANALYTICS_SESSION_STORAGE_KEY) || 'null'
    );
    if (!session?.id) {
      return;
    }

    storage.setItem(
      ANALYTICS_SESSION_STORAGE_KEY,
      JSON.stringify({
        ...session,
        lastActivityAt: now,
        lastPath: path || session.lastPath || '',
      })
    );
  } catch {}
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
    visitorId: view.visitorId,
    sessionId: view.sessionId,
    sessionPageIndex: view.sessionPageIndex,
    path: view.path,
    previousPath: view.previousPath,
    referrerHost: view.referrerHost,
    ...view.campaign,
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
    visitorId: view.visitorId,
    sessionId: view.sessionId,
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

function createPageView(path, lastTouchedAtRef) {
  const normalizedPath = normalizePath(path);
  const session = loadSessionState(normalizedPath);

  touchSession(normalizedPath, lastTouchedAtRef);

  return {
    pageViewId: createId('pageview'),
    visitorId: getOrCreateVisitorId(),
    sessionId: session.sessionId,
    sessionPageIndex: session.sessionPageIndex,
    path: normalizedPath,
    previousPath: session.previousPath || '',
    referrerHost: session.referrerHost,
    campaign: {
      ...emptyCampaignParams(),
      ...(session.campaign || {}),
    },
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
  const lastTouchedAtRef = useRef(0);
  const [analyticsConsentGranted, setAnalyticsConsentGranted] =
    useState(hasAnalyticsConsent);

  useEffect(() => {
    function handleAnalyticsConsentChange(event) {
      const granted = Boolean(event.detail?.granted);
      if (!granted) {
        clearStoredAnalyticsState();
        currentViewRef.current = null;
        lastTouchedAtRef.current = 0;
      }

      setAnalyticsConsentGranted(granted);
    }

    setAnalyticsConsentGranted(hasAnalyticsConsent());
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
      lastTouchedAtRef.current = 0;
      return;
    }

    const nextPath = normalizePath(pathname || '/');
    const currentView = currentViewRef.current;
    const shouldSkipTracking = isIgnoredAnalyticsPath(nextPath) || isAnalyticsOptedOut();

    if (shouldSkipTracking) {
      clearStoredAnalyticsState();
      currentViewRef.current = null;
      lastTouchedAtRef.current = 0;
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

    const nextView = createPageView(nextPath, lastTouchedAtRef);
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
      touchSession(currentView.path, lastTouchedAtRef);
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
      touchSession(currentView.path, lastTouchedAtRef);
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
        touchSession(currentView.path, lastTouchedAtRef);
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
      touchSession(currentView.path, lastTouchedAtRef);
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
      touchSession(currentView.path, lastTouchedAtRef);
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

      touchSession(currentView.path, lastTouchedAtRef);
      sendEvent(currentView, event.detail || {});
    }

    const interval = globalThis.setInterval(() => {
      const currentView = currentViewRef.current;
      if (!currentView || document.visibilityState === 'hidden') {
        return;
      }

      touchSession(currentView.path, lastTouchedAtRef);
    }, SESSION_TOUCH_INTERVAL_MS);

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
      globalThis.clearInterval(interval);
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
