'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import SafeLink from '@/components/SafeLink/SafeLink';
import {
  REVIEW_ERROR_MESSAGE,
  REVIEW_SESSION_ENDPOINT,
  REVIEW_SUBMIT_ENDPOINT,
  REVIEW_SUCCESS_MESSAGE,
} from '@/lib/copy/reviewMessages';

import classes from './ReviewPage.module.css';

const STAR_OPTIONS = [1, 2, 3, 4, 5];
const FIRST_MONTH_GUIDE_PATH =
  '/opas/kompostorin-hoito/ensimmaiset-30-paivaa-matokompostorin-kaynnistys';

function getStars(value) {
  return '\u2605'.repeat(value);
}

function normalizeProductTargets(value, fallback) {
  const targets = Array.isArray(value)
    ? value
        .map((target) => ({
          productKey: String(target?.productKey || target?.key || '').trim(),
          productName: String(target?.productName || target?.name || '').trim(),
        }))
        .filter((target) => target.productKey && target.productName)
    : [];

  return targets.length ? targets : fallback ? [fallback] : [];
}

export default function ReviewPageClient() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [session, setSession] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [privateFeedback, setPrivateFeedback] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedProductKeys, setSelectedProductKeys] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const nextToken = searchParams.get('token')?.trim() || '';
    setToken(nextToken);
    setSession(null);
    setSubmitError('');
    setSessionError('');
    setIsSubmitted(false);
    setSelectedProductKeys([]);

    if (!nextToken) {
      setIsLoadingSession(false);
      setSessionError('Arvostelulinkki puuttuu osoitteesta.');
      return;
    }

    const controller = new AbortController();
    const validateToken = async () => {
      setIsLoadingSession(true);

      try {
        const response = await fetch(
          `${REVIEW_SESSION_ENDPOINT}?token=${encodeURIComponent(nextToken)}`,
          {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
          }
        );

        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.ok) {
          throw new Error(data?.message || REVIEW_ERROR_MESSAGE);
        }

        const fallbackTarget =
          data.productKey && data.productName
            ? {
                productKey: data.productKey,
                productName: data.productName,
              }
            : null;
        const productTargets = normalizeProductTargets(
          data.productTargets,
          fallbackTarget
        );

        setSession({
          orderId: data.orderId || '',
          productKey: data.productKey || '',
          productName: data.productName || '',
          productTargets,
          testMode: Boolean(data.testMode),
        });
        setSelectedProductKeys(productTargets.map((target) => target.productKey));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setSessionError(
          error instanceof Error
            ? error.message
            : 'Arvostelulinkin tarkistus epäonnistui.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSession(false);
        }
      }
    };

    validateToken();

    return () => {
      controller.abort();
    };
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting || isSubmitted) {
      return;
    }

    if (!token) {
      setSubmitError('Arvostelulinkki puuttuu.');
      return;
    }

    if (!rating) {
      setSubmitError('Valitse tähtiarvio ennen lähetystä.');
      return;
    }

    if ((session?.productTargets?.length || 0) > 1 && selectedProductKeys.length === 0) {
      setSubmitError('Valitse vähintään yksi tuote, jota arvostelu koskee.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(REVIEW_SUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          rating,
          review,
          privateFeedback,
          displayName,
          productKeys: selectedProductKeys,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        throw new Error(data?.message || REVIEW_ERROR_MESSAGE);
      }

      setIsSubmitted(true);
      setSessionError('');
      setReview('');
      setPrivateFeedback('');
      setDisplayName('');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : REVIEW_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingSession) {
    return (
      <section className={classes.Card} aria-live="polite">
        <p className={classes.StatusRow}>
          <span className={classes.Spinner} aria-hidden="true" />
          Tarkistetaan arvostelulinkkiä...
        </p>
      </section>
    );
  }

  if (sessionError) {
    return (
      <section className={classes.Card} aria-live="polite">
        <p className={classes.Error}>{sessionError}</p>
      </section>
    );
  }

  function handleProductTargetChange(productKey) {
    setSelectedProductKeys((currentValue) =>
      currentValue.includes(productKey)
        ? currentValue.filter((value) => value !== productKey)
        : [...currentValue, productKey]
    );
  }

  return (
    <section className={classes.Card} aria-live="polite">
      <div className={classes.Header}>
        <h2>Jätä arvostelu</h2>
        <p className={classes.OrderMeta}>
          {session?.productName || 'Tilauksesi'} / {session?.orderId || ''}
        </p>
      </div>

      {isSubmitted ? (
        <div className={classes.SuccessBlock}>
          <p className={classes.Success}>
            {session?.testMode
              ? 'Testiarvostelun lähetys onnistui. Testiarvostelua ei tallenneta eikä se estä linkin käyttöä uudelleen.'
              : REVIEW_SUCCESS_MESSAGE}
          </p>
          <div className={classes.NextSteps}>
            <p>Seuraavaksi voit jatkaa näistä:</p>
            <ul>
              <li>
                <SafeLink href={FIRST_MONTH_GUIDE_PATH}>
                  Ensimmäiset 30 päivää uudessa matokompostorissa
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/opas">Matokompostoinnin oppaat</SafeLink>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <form
          className={classes.Form}
          onSubmit={handleSubmit}
          data-analytics-form="review"
        >
          <fieldset className={classes.Label}>
            <legend>Tähtiarvio</legend>
            <div className={classes.Stars}>
              {STAR_OPTIONS.map((value) => (
                <div key={value} className={classes.StarOption}>
                  <input
                    id={`review-rating-${value}`}
                    className={classes.StarInput}
                    type="radio"
                    name="rating"
                    value={value}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                  />
                  <label className={classes.StarLabel} htmlFor={`review-rating-${value}`}>
                    <span className={classes.StarGlyphs}>{getStars(value)}</span>
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          {session?.testMode ? (
            <p className={classes.TestModeNotice}>
              Testitilassa lähetystä ei tallenneta eikä linkki vanhene.
            </p>
          ) : null}

          {session?.productTargets?.length > 1 ? (
            <fieldset className={classes.Label}>
              <legend>Mitä tuotteita arvostelu koskee?</legend>
              <div className={classes.ProductTargetList}>
                {session.productTargets.map((target) => (
                  <label key={target.productKey} className={classes.ProductTargetOption}>
                    <input
                      type="checkbox"
                      name="productKeys"
                      value={target.productKey}
                      checked={selectedProductKeys.includes(target.productKey)}
                      onChange={() => handleProductTargetChange(target.productKey)}
                    />
                    <span>{target.productName}</span>
                  </label>
                ))}
              </div>
              <p className={classes.HelpText}>
                Valitse tuotteet, joihin arvostelusi liittyy. Tarkistan valinnan vielä
                ennen julkaisua.
              </p>
            </fieldset>
          ) : null}

          <label className={classes.Label}>
            Kirjoitettu arvostelu (valinnainen)
            <textarea
              className={classes.Textarea}
              name="review"
              rows="5"
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder="Millainen kokemus sinulla oli tuotteesta tai toimituksesta?"
            />
          </label>

          <label className={classes.Label}>
            Yksityinen palaute Joonakselle (valinnainen)
            <textarea
              className={classes.Textarea}
              name="privateFeedback"
              rows="4"
              value={privateFeedback}
              onChange={(event) => setPrivateFeedback(event.target.value)}
              placeholder="Jos jokin ei toiminut odotetusti, voit kertoa sen tässä. Tätä kenttää ei julkaista sivustolla."
            />
          </label>

          <label className={classes.Label}>
            Näyttönimi (valinnainen)
            <input
              className={classes.Input}
              type="text"
              name="displayName"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Esim. Matti tai Nimimerkki"
            />
          </label>

          <p className={classes.HelpText}>
            Arvostelu tallennetaan ensin tarkistettavaksi. Se ei näy sivustolla ennen
            manuaalista hyväksyntää.
          </p>

          {submitError ? (
            <p className={classes.Error} role="alert">
              {submitError}
            </p>
          ) : null}

          <button
            type="submit"
            className={classes.SubmitButton}
            disabled={isSubmitting || isSubmitted}
          >
            {isSubmitting ? 'Lähetetään arvostelua...' : 'Lähetä arvostelu'}
          </button>
        </form>
      )}
    </section>
  );
}
