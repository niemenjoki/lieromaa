'use client';

import { useEffect, useMemo, useState } from 'react';

import { usePathname } from 'next/navigation';

import classes from './VisitorFeedbackWidget.module.css';

const SESSION_START_KEY = 'lieromaa_session_start';
const PAGES_VISITED_KEY = 'lieromaa_pages_visited';
const LAST_SHOWN_KEY = 'lieromaa_feedback_last_shown';

const VISIT_INITIALIZED_KEY = 'lieromaa_feedback_visit_initialized';
const SHOWN_THIS_VISIT_KEY = 'lieromaa_feedback_shown_this_visit';
const LAST_COUNTED_ROUTE_KEY = 'lieromaa_feedback_last_counted_route';

const MIN_SESSION_DURATION_MS = 120 * 1000;
const MIN_PAGES_VISITED = 3;
const SCROLL_DEPTH_THRESHOLD = 0.6;
const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbdzreow';

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function VisitorFeedbackWidget() {
  const pathname = usePathname();

  const [sessionStart, setSessionStart] = useState(null);
  const [pagesVisited, setPagesVisited] = useState(0);
  const [hasReachedScrollDepth, setHasReachedScrollDepth] = useState(false);
  const [isSessionLongEnough, setIsSessionLongEnough] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const isEngaged = useMemo(
    () =>
      isSessionLongEnough && pagesVisited >= MIN_PAGES_VISITED && hasReachedScrollDepth,
    [hasReachedScrollDepth, isSessionLongEnough, pagesVisited]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) {
      return;
    }

    const now = Date.now();
    if (!sessionStorage.getItem(VISIT_INITIALIZED_KEY)) {
      localStorage.setItem(SESSION_START_KEY, String(now));
      localStorage.setItem(PAGES_VISITED_KEY, '0');

      sessionStorage.setItem(VISIT_INITIALIZED_KEY, '1');
      sessionStorage.removeItem(SHOWN_THIS_VISIT_KEY);
      sessionStorage.removeItem(LAST_COUNTED_ROUTE_KEY);
    }

    const lastCountedRoute = sessionStorage.getItem(LAST_COUNTED_ROUTE_KEY);
    if (lastCountedRoute !== pathname) {
      const nextPageCount = parseNumber(localStorage.getItem(PAGES_VISITED_KEY), 0) + 1;
      localStorage.setItem(PAGES_VISITED_KEY, String(nextPageCount));
      sessionStorage.setItem(LAST_COUNTED_ROUTE_KEY, pathname);
      setPagesVisited(nextPageCount);
    } else {
      setPagesVisited(parseNumber(localStorage.getItem(PAGES_VISITED_KEY), 0));
    }

    const storedSessionStart = parseNumber(localStorage.getItem(SESSION_START_KEY), now);
    localStorage.setItem(SESSION_START_KEY, String(storedSessionStart));
    setSessionStart(storedSessionStart);

    setHasReachedScrollDepth(false);
  }, [pathname]);

  useEffect(() => {
    if (sessionStart === null || typeof window === 'undefined') {
      return;
    }

    const elapsed = Date.now() - sessionStart;
    if (elapsed >= MIN_SESSION_DURATION_MS) {
      setIsSessionLongEnough(true);
      return;
    }

    setIsSessionLongEnough(false);
    const timerId = window.setTimeout(() => {
      setIsSessionLongEnough(true);
    }, MIN_SESSION_DURATION_MS - elapsed);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [sessionStart]);

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) {
      return;
    }

    const marker = document.createElement('div');
    marker.className = classes.ScrollMarker;
    marker.setAttribute('aria-hidden', 'true');
    document.body.appendChild(marker);

    let rafId = 0;
    const updateMarkerPosition = () => {
      const rootHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      marker.style.top = `${Math.round(rootHeight * SCROLL_DEPTH_THRESHOLD)}px`;
    };

    const scheduleUpdate = () => {
      if (rafId) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateMarkerPosition();
      });
    };

    updateMarkerPosition();

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      setHasReachedScrollDepth(true);
      observer.disconnect();
    });
    observer.observe(marker);

    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate);

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(document.body);
    }

    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('load', scheduleUpdate);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      marker.remove();
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isEngaged || isVisible || isSubmitted) {
      return;
    }

    if (sessionStorage.getItem(SHOWN_THIS_VISIT_KEY) === '1') {
      return;
    }

    const now = Date.now();
    const lastShown = parseNumber(localStorage.getItem(LAST_SHOWN_KEY), 0);

    if (lastShown && now - lastShown < COOLDOWN_MS) {
      return;
    }

    localStorage.setItem(LAST_SHOWN_KEY, String(now));
    sessionStorage.setItem(SHOWN_THIS_VISIT_KEY, '1');
    setIsVisible(true);
  }, [isEngaged, isSubmitted, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setSubmitError('Kuvaile kysymyksesi tai ongelmasi ennen lähetystä.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const formData = new FormData(event.currentTarget);
    formData.set('kysymys', trimmedMessage);
    formData.set('sivu_url', window.location.href);
    formData.set('referrer', document.referrer || '');

    if (!email.trim()) {
      formData.delete('email');
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Lomakkeen lähetys epäonnistui');
      }

      setIsSubmitted(true);
      setMessage('');
      setEmail('');
    } catch {
      setSubmitError('Viestin lähetys epäonnistui. Yritä hetken kuluttua uudelleen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside className={classes.Widget} aria-live="polite">
      {!isSubmitted ? <h2>Et löytänyt etsimääsi?</h2> : <h2>Kiitos</h2>}

      {!isSubmitted ? (
        <>
          <p>
            Jos etsit ratkaisua matokompostointiin liittyvään ongelmaan, etkä löydä sitä
            tältä sivustolta, voit laittaa minulle viestin alla olevan lomakkeen kautta.
            Halutessasi vastaan viestiisi sähköpostitse. Saatan myös kirjoittaa ongelman
            ratkaisusta uuden sivun Lieromaan oppaaseen.
          </p>

          <form action={FORMSPREE_ENDPOINT} method="POST" onSubmit={handleSubmit}>
            <input
              type="text"
              name="_gotcha"
              className={classes.Gotcha}
              tabIndex="-1"
              autoComplete="off"
            />

            <textarea
              name="kysymys"
              required
              rows="4"
              placeholder="Kysy kysymys tai kuvaile ongelmaasi"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />

            <input
              type="email"
              name="email"
              placeholder="Sähköposti (valinnainen, jos haluat vastauksen)"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            {submitError ? <p className={classes.Error}>{submitError}</p> : null}

            <div className={classes.Actions}>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Lähetetään...' : 'Lähetä'}
              </button>
              <button type="button" onClick={handleClose} disabled={isSubmitting}>
                Sulje
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <p className={classes.Thanks}>
            Kiitos viestistäsi! Luen kaikki viestit. Jos jätit sähköpostiosoitteesi,
            vastaan sinulle mahdollisimman pian.
          </p>
          <div className={classes.Actions}>
            <button type="button" onClick={handleClose}>
              Sulje
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
