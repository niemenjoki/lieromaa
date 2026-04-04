'use client';

import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

const ANALYTICS_ENDPOINT = '/api/analytics';
const VISITOR_ID_STORAGE_KEY = 'lieromaa.analytics.visitor';
const SESSION_STORAGE_KEY = 'lieromaa.analytics.session';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_TOUCH_INTERVAL_MS = 60 * 1000;

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

function normalizePath(value) {
  const baseValue = String(value || '/').trim();
  const withoutHash = baseValue.split('#')[0] || '/';
  const withoutQuery = withoutHash.split('?')[0] || '/';
  const normalized = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;

  return normalized.length > 200 ? normalized.slice(0, 200) : normalized;
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
  const existingId = storage?.getItem(VISITOR_ID_STORAGE_KEY);
  if (existingId) {
    return existingId;
  }

  const nextId = createId('visitor');
  storage?.setItem(VISITOR_ID_STORAGE_KEY, nextId);
  return nextId;
}

function loadSessionState(currentPath) {
  const storage = getStorage('sessionStorage');
  const now = Date.now();
  let session = null;

  if (storage) {
    try {
      session = JSON.parse(storage.getItem(SESSION_STORAGE_KEY) || 'null');
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
    };
  }

  const previousPath =
    session.lastPath && session.lastPath !== currentPath ? session.lastPath : '';

  session.pageCount = Number(session.pageCount || 0) + 1;
  session.lastPath = currentPath;
  session.lastActivityAt = now;

  storage?.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

  return {
    sessionId: session.id,
    sessionPageIndex: session.pageCount,
    previousPath,
    referrerHost: String(session.referrerHost || ''),
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
    const session = JSON.parse(storage.getItem(SESSION_STORAGE_KEY) || 'null');
    if (!session?.id) {
      return;
    }

    storage.setItem(
      SESSION_STORAGE_KEY,
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
    pageViewId: view.pageViewId,
    visitorId: view.visitorId,
    sessionId: view.sessionId,
    sessionPageIndex: view.sessionPageIndex,
    path: view.path,
    previousPath: view.previousPath,
    referrerHost: view.referrerHost,
    startedAt: new Date(view.startedAtMs).toISOString(),
    endedAt: new Date(now).toISOString(),
    dwellMs: Math.max(0, Math.round(getDwellMs(view, now))),
    maxScrollPercent: Number(Math.min(100, view.maxScrollPercent).toFixed(2)),
    formStartCount: view.startedForms.size,
    formSubmitCount: view.submittedForms.size,
    orderClickCount: view.orderClickCount,
  };
}

function sendPayload(payload) {
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

  useEffect(() => {
    const nextPath = normalizePath(pathname || '/');
    const currentView = currentViewRef.current;

    if (currentView?.path === nextPath) {
      return;
    }

    if (currentView) {
      currentView.maxScrollPercent = Math.max(
        currentView.maxScrollPercent,
        getCurrentScrollDepth()
      );
      pauseView(currentView);
      sendPayload(buildPayload(currentView));
    }

    const nextView = createPageView(nextPath, lastTouchedAtRef);
    currentViewRef.current = nextView;
    sendPayload(buildPayload(nextView, nextView.startedAtMs));
  }, [pathname]);

  useEffect(() => {
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
      sendPayload(buildPayload(currentView));
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
      sendCurrentSnapshot();
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

      const currentView = currentViewRef.current;
      if (currentView) {
        currentView.maxScrollPercent = Math.max(
          currentView.maxScrollPercent,
          getCurrentScrollDepth()
        );
        pauseView(currentView);
        sendPayload(buildPayload(currentView));
      }
    };
  }, []);

  return null;
}
