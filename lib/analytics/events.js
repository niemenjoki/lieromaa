'use client';

export const ANALYTICS_CUSTOM_EVENT_NAME = 'lieromaa:analytics-event';

export function trackAnalyticsEvent(eventName, detail = {}) {
  if (typeof window === 'undefined' || !eventName) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(ANALYTICS_CUSTOM_EVENT_NAME, {
      detail: {
        ...detail,
        eventName,
      },
    })
  );
}
