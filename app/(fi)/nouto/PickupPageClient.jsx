'use client';

import { useEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import {
  PICKUP_BOOK_ENDPOINT,
  PICKUP_PHOTO_ENDPOINT,
  PICKUP_SESSION_ENDPOINT,
  PICKUP_SUPPORT_EMAIL,
} from '@/lib/copy/pickupMessages';
import { getTransactionMessages } from '@/lib/i18n/messages.mjs';

import classes from './PickupPage.module.css';

// Varaussivu näyttää vain lyhyet ohjeet. Osoite ja tarkat nouto-ohjeet lähetetään sähköpostilla varauksen jälkeen.

const LOCALES = { fi: 'fi-FI', en: 'en-GB' };

function formatDay(dateKey, language) {
  const date = new Date(`${dateKey}T12:00:00Z`);
  const weekday = new Intl.DateTimeFormat(LOCALES[language], {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(date);
  const day = new Intl.DateTimeFormat(LOCALES[language], {
    day: 'numeric',
    month: language === 'en' ? 'long' : 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
  return { weekday, day };
}

function formatTime(time, language) {
  const value = String(time || '');
  return language === 'en' ? value : value.replace(/^0/, '').replace(':', '.');
}

function groupOptionsByDate(options) {
  const groups = new Map();
  for (const option of options) {
    if (!groups.has(option.date)) {
      groups.set(option.date, []);
    }
    groups.get(option.date).push(option);
  }
  return [...groups.entries()];
}

async function fetchSession(token, language, { signal, fallbackMessage } = {}) {
  const response = await fetch(
    `${PICKUP_SESSION_ENDPOINT}?token=${encodeURIComponent(token)}`,
    {
      method: 'GET',
      cache: 'no-store',
      signal,
      headers: {
        Accept: 'application/json',
        'X-Lieromaa-Language': language,
      },
    }
  );
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.ok) {
    throw new Error(data?.message || fallbackMessage);
  }
  return data;
}

export default function PickupPageClient({ language = 'fi' }) {
  const copy = getTransactionMessages(language).pickup;
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    const nextToken = searchParams.get('token')?.trim() || '';
    setToken(nextToken);
    setSession(null);
    setLoadError('');
    setSubmitError('');
    setSelectedOptionId('');

    if (!nextToken) {
      setIsLoading(false);
      setLoadError(copy.missingLinkAddress);
      return undefined;
    }

    const controller = new AbortController();
    const loadSession = async () => {
      setIsLoading(true);
      try {
        setSession(
          await fetchSession(nextToken, language, {
            signal: controller.signal,
            fallbackMessage: copy.linkCheckFailed,
          })
        );
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        setLoadError(
          error instanceof Error && error.message ? error.message : copy.linkCheckFailed
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadSession();
    return () => controller.abort();
  }, [searchParams, copy, language]);

  const optionGroups = useMemo(
    () => groupOptionsByDate(Array.isArray(session?.options) ? session.options : []),
    [session]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');
    if (!selectedOptionId) {
      setSubmitError(copy.selectRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(PICKUP_BOOK_ENDPOINT, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Lieromaa-Language': language,
        },
        body: JSON.stringify({ token, optionId: Number(selectedOptionId) }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        if (data?.code === 'pickup_slot_unavailable') {
          // Joku ehti varata ajan: haetaan jäljellä olevat ajat uudelleen, koska muitakin aikoja on voinut poistua.
          setSelectedOptionId('');
          const refreshed = await fetchSession(token, language).catch(() => null);
          if (refreshed) {
            setSession(refreshed);
          }
        }
        throw new Error(data?.message || copy.genericError);
      }
      setSession(data);
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message ? error.message : copy.genericError
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className={classes.Card} aria-live="polite">
        <p className={classes.StatusRow}>
          <span className={classes.Spinner} aria-hidden="true" />
          {copy.checking}
        </p>
      </section>
    );
  }

  if (loadError || !session) {
    return (
      <section className={classes.Card} aria-live="polite">
        <p className={classes.Error}>{loadError || copy.linkCheckFailed}</p>
        <p className={classes.HelpText}>
          {copy.contactHelp({ email: PICKUP_SUPPORT_EMAIL })}
        </p>
      </section>
    );
  }

  const cancelHelp = copy.cancelHelp({
    phone: session.ownerPhone,
    whatsappUrl: session.whatsappUrl,
  });

  const header = (
    <div className={classes.Header}>
      <h2>{copy.greeting({ firstName: session.firstName })}</h2>
      <p className={classes.OrderMeta}>{copy.orderLabel({ orderId: session.orderId })}</p>
      {session.pickupDay ? (
        <p className={classes.OrderMeta}>
          {copy.pickupDay({ date: formatDay(session.pickupDay, language).day })}
        </p>
      ) : null}
      {Array.isArray(session.items) && session.items.length ? (
        <ul className={classes.Items}>
          {session.items.map((item, index) => (
            <li key={`${item.name}-${index}`}>
              {item.name}
              {item.packages > 1 ? ` (${copy.packages({ count: item.packages })})` : ''}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  if (session.status === 'collected' || session.status === 'manual') {
    return (
      <section className={classes.Card} aria-live="polite">
        {header}
        <p>{session.status === 'collected' ? copy.collected : copy.manual}</p>
      </section>
    );
  }

  if ((session.status === 'booked' || session.status === 'ready') && session.booking) {
    const { weekday, day } = formatDay(session.booking.date, language);
    const photoUrl = `${PICKUP_PHOTO_ENDPOINT}?token=${encodeURIComponent(token)}`;
    return (
      <section className={classes.Card} aria-live="polite">
        {header}
        <div className={classes.Booked}>
          <h3>{session.status === 'ready' ? copy.readyHeading : copy.bookedHeading}</h3>
          <p className={classes.BookedTime}>
            {copy.bookedTime({
              weekday,
              date: day,
              start: formatTime(session.booking.start, language),
              end: formatTime(session.booking.end, language),
            })}
          </p>
          <p>{session.status === 'ready' ? copy.readyNote : copy.bookedEmailNote}</p>
          {session.photo && !photoFailed ? (
            // Kuva tulee tokenilla suojatusta reitistä, joten next/image-optimointia ei käytetä.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={classes.Photo}
              src={photoUrl}
              alt={copy.photoAlt}
              onError={() => setPhotoFailed(true)}
            />
          ) : null}
          <p className={classes.HelpText}>{cancelHelp}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={classes.Card}>
      {header}
      {optionGroups.length ? (
        <form className={classes.Form} onSubmit={handleSubmit} noValidate>
          <fieldset className={classes.Fieldset}>
            <legend>{copy.optionsLegend}</legend>
            {optionGroups.map(([date, options]) => {
              const { weekday, day } = formatDay(date, language);
              return (
                <div className={classes.Day} key={date}>
                  <p className={classes.DayLabel}>{`${weekday} ${day}`}</p>
                  <div className={classes.SlotList}>
                    {options.map((option) => (
                      <label className={classes.SlotOption} key={option.id}>
                        <input
                          className={classes.SlotInput}
                          type="radio"
                          name="pickup-time"
                          value={String(option.id)}
                          checked={selectedOptionId === String(option.id)}
                          onChange={() => setSelectedOptionId(String(option.id))}
                        />
                        <span className={classes.SlotLabel}>
                          {copy.optionLabel({
                            start: formatTime(option.start, language),
                            end: formatTime(option.end, language),
                          })}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </fieldset>
          <p className={classes.HelpText}>
            {copy.deadlineHelp({ hour: session.bookingDeadlineHour ?? 20 })}
          </p>
          {submitError ? (
            <p className={classes.Error} role="alert">
              {submitError}
            </p>
          ) : null}
          <button className={classes.SubmitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? copy.submitting : copy.submit}
          </button>
        </form>
      ) : (
        <>
          {submitError ? (
            <p className={classes.Error} role="alert">
              {submitError}
            </p>
          ) : null}
          <p className={classes.Error}>
            {copy.noOptions({ phone: session.ownerPhone, email: PICKUP_SUPPORT_EMAIL })}
          </p>
        </>
      )}
    </section>
  );
}
