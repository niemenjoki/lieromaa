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
  return language === 'en' ? time : String(time || '').replace(':', '.');
}

function groupSlotsByDate(slots) {
  const groups = new Map();
  for (const slot of slots) {
    if (!groups.has(slot.date)) {
      groups.set(slot.date, []);
    }
    groups.get(slot.date).push(slot);
  }
  return [...groups.entries()];
}

export default function PickupPageClient({ language = 'fi' }) {
  const copy = getTransactionMessages(language).pickup;
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [justBooked, setJustBooked] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    const nextToken = searchParams.get('token')?.trim() || '';
    setToken(nextToken);
    setSession(null);
    setLoadError('');
    setSubmitError('');
    setSelectedSlotId('');
    setJustBooked(false);

    if (!nextToken) {
      setIsLoading(false);
      setLoadError(copy.missingLinkAddress);
      return undefined;
    }

    const controller = new AbortController();
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${PICKUP_SESSION_ENDPOINT}?token=${encodeURIComponent(nextToken)}`,
          {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
            headers: {
              Accept: 'application/json',
              'X-Lieromaa-Language': language,
            },
          }
        );
        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.ok) {
          throw new Error(data?.message || copy.linkCheckFailed);
        }
        setSession(data);
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

  const slotGroups = useMemo(
    () => groupSlotsByDate(Array.isArray(session?.slots) ? session.slots : []),
    [session]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');
    if (!selectedSlotId) {
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
        body: JSON.stringify({ token, slotId: Number(selectedSlotId) }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        if (data?.code === 'pickup_slot_unavailable') {
          setSession((current) =>
            current
              ? {
                  ...current,
                  slots: (current.slots || []).filter(
                    (slot) => String(slot.id) !== selectedSlotId
                  ),
                }
              : current
          );
          setSelectedSlotId('');
        }
        throw new Error(data?.message || copy.genericError);
      }
      setSession(data);
      setJustBooked(true);
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

  const header = (
    <div className={classes.Header}>
      <h2>{copy.greeting({ firstName: session.firstName })}</h2>
      <p className={classes.OrderMeta}>{copy.orderLabel({ orderId: session.orderId })}</p>
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

  if (session.status === 'booked' && session.booking) {
    const { weekday, day } = formatDay(session.booking.date, language);
    const photoUrl = `${PICKUP_PHOTO_ENDPOINT}?token=${encodeURIComponent(token)}`;
    return (
      <section className={classes.Card} aria-live="polite">
        {header}
        <div className={classes.Booked}>
          <h3>{copy.bookedHeading}</h3>
          <p className={classes.BookedTime}>
            {copy.bookedTime({
              weekday,
              date: day,
              start: formatTime(session.booking.start, language),
              end: formatTime(session.booking.end, language),
            })}
          </p>
          {justBooked ? <p className={classes.HelpText}>{copy.bookedEmailNote}</p> : null}
          <div>
            <h3>{copy.addressHeading}</h3>
            <p className={classes.Address}>
              {(session.address || []).map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
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
          <p className={classes.Instructions}>{session.booking.instructions}</p>
          <p className={classes.HelpText}>
            {copy.changeHelp({ phone: session.ownerPhone })}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={classes.Card}>
      {header}
      {slotGroups.length ? (
        <form className={classes.Form} onSubmit={handleSubmit} noValidate>
          <fieldset className={classes.Fieldset}>
            <legend>{copy.slotsLegend}</legend>
            {slotGroups.map(([date, slots]) => {
              const { weekday, day } = formatDay(date, language);
              return (
                <div className={classes.Day} key={date}>
                  <p className={classes.DayLabel}>{`${weekday} ${day}`}</p>
                  <div className={classes.SlotList}>
                    {slots.map((slot) => (
                      <label className={classes.SlotOption} key={slot.id}>
                        <input
                          className={classes.SlotInput}
                          type="radio"
                          name="slot"
                          value={String(slot.id)}
                          checked={selectedSlotId === String(slot.id)}
                          onChange={() => setSelectedSlotId(String(slot.id))}
                        />
                        <span className={classes.SlotLabel}>
                          {copy.slotLabel({
                            start: formatTime(slot.start, language),
                            end: formatTime(slot.end, language),
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
        <p className={classes.Error}>
          {copy.noSlots({ phone: session.ownerPhone, email: PICKUP_SUPPORT_EMAIL })}
        </p>
      )}
    </section>
  );
}
