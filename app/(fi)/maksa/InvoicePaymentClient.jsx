'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import pickupClasses from '@/app/(fi)/nouto/PickupPage.module.css';
import { ORDER_CONTACT_EMAIL } from '@/data/site/contact';
import { getTransactionMessages } from '@/lib/i18n/messages.mjs';
import { getRoutePath } from '@/lib/i18n/routes.mjs';

import classes from './InvoicePayment.module.css';

// Laskun maksusivu: maksukoodi osoitteessa (/maksa/<koodi>) tai syötettynä. Sivu ei kerro koodin muotoa, jotta
// muut kuin asiakkaat eivät saa siitä vihjettä. Sivu näyttää vain laskun numeron,
// summan ja eräpäivän, ja maksu jatkuu suojatulle maksusivulle (MobilePay tai kortti).

const SESSION_ENDPOINT = '/api/invoice-payment/session';
const CHECKOUT_ENDPOINT = '/api/invoice-payment/checkout';
const LOCALES = { fi: 'fi-FI', en: 'en-GB' };
const CONFIRM_POLL_INTERVAL_MS = 2000;
const CONFIRM_POLL_ATTEMPTS = 8;

function normalizePaymentCode(value) {
  const compact = String(value || '')
    .toUpperCase()
    .replace(/[\s-]/g, '');
  return /^[1-9A-NP-Z]{8}$/.test(compact) ? compact : '';
}

function formatCode(code) {
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

function formatAmount(cents, language) {
  return new Intl.NumberFormat(LOCALES[language], {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

function formatDate(dateKey, language) {
  return new Intl.DateTimeFormat(LOCALES[language], {
    day: 'numeric',
    month: language === 'en' ? 'long' : 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dateKey}T12:00:00Z`));
}

async function fetchSession(code, language, { signal, fallbackMessage } = {}) {
  const response = await fetch(`${SESSION_ENDPOINT}?code=${encodeURIComponent(code)}`, {
    method: 'GET',
    cache: 'no-store',
    signal,
    headers: { Accept: 'application/json', 'X-Lieromaa-Language': language },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.ok) {
    throw new Error(data?.message || fallbackMessage);
  }
  return data;
}

function wait(ms, signal) {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

export default function InvoicePaymentClient({ language = 'fi' }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = normalizePaymentCode(params?.koodi || params?.code || '');
  const returning = searchParams.get('stripe') === 'return';
  if (!code) {
    return (
      <CodeForm language={language} invalid={Boolean(params?.koodi || params?.code)} />
    );
  }
  // Uusi koodi alustaa näkymän kokonaan, joten tilaa ei tarvitse nollata efektissä.
  return (
    <InvoicePayment key={code} code={code} language={language} returning={returning} />
  );
}

function CodeForm({ language, invalid }) {
  const copy = getTransactionMessages(language).invoicePayment;
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState(invalid ? copy.codeInvalid : '');

  function handleSubmit(event) {
    event.preventDefault();
    const code = normalizePaymentCode(value);
    if (!code) {
      setError(copy.codeInvalid);
      return;
    }
    router.push(`${getRoutePath('invoicePayment', language)}/${code}`);
  }

  return (
    <section className={pickupClasses.Card}>
      <form className={classes.Form} onSubmit={handleSubmit} noValidate>
        <label className={classes.Label} htmlFor="invoice-payment-code">
          {copy.codeLabel}
        </label>
        <input
          id="invoice-payment-code"
          className={classes.CodeInput}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          inputMode="text"
          maxLength={12}
          aria-describedby="invoice-payment-code-help"
        />
        <p id="invoice-payment-code-help" className={pickupClasses.HelpText}>
          {copy.codeHelp}
        </p>
        {error ? (
          <p className={pickupClasses.Error} role="alert">
            {error}
          </p>
        ) : null}
        <button className={pickupClasses.SubmitButton} type="submit">
          {copy.continue}
        </button>
      </form>
    </section>
  );
}

function InvoicePayment({ code, language, returning }) {
  const copy = getTransactionMessages(language).invoicePayment;
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [confirmSlow, setConfirmSlow] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      // Maksusivulta palatessa maksun vahvistus voi tulla hetken viiveellä.
      const attempts = returning ? CONFIRM_POLL_ATTEMPTS : 1;
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        const data = await fetchSession(code, language, {
          signal: controller.signal,
          fallbackMessage: copy.genericError,
        });
        if (controller.signal.aborted) return;
        setSession(data);
        setIsLoading(false);
        if (data.status !== 'open') return;
        if (attempt < attempts - 1)
          await wait(CONFIRM_POLL_INTERVAL_MS, controller.signal);
      }
      if (returning && !controller.signal.aborted) setConfirmSlow(true);
    }
    load().catch((error) => {
      if (!controller.signal.aborted) {
        setLoadError(
          error instanceof Error && error.message ? error.message : copy.genericError
        );
        setIsLoading(false);
      }
    });
    return () => controller.abort();
  }, [code, language, returning, copy]);

  async function handlePay() {
    setPayError('');
    setIsOpening(true);
    try {
      const response = await fetch(CHECKOUT_ENDPOINT, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Lieromaa-Language': language,
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok || !data.url) {
        throw new Error(data?.message || copy.genericError);
      }
      window.location.assign(data.url);
    } catch (error) {
      setPayError(
        error instanceof Error && error.message ? error.message : copy.genericError
      );
      setIsOpening(false);
    }
  }

  const otherCodeLink = (
    <p className={pickupClasses.HelpText}>
      <Link href={getRoutePath('invoicePayment', language)}>{copy.otherCode}</Link>
    </p>
  );

  if (isLoading || (returning && session?.status === 'open' && !confirmSlow)) {
    return (
      <section className={pickupClasses.Card} aria-live="polite">
        <p className={pickupClasses.StatusRow}>
          <span className={pickupClasses.Spinner} aria-hidden="true" />
          {returning ? copy.confirming : copy.checking}
        </p>
      </section>
    );
  }

  if (loadError || !session) {
    return (
      <section className={pickupClasses.Card} aria-live="polite">
        <p className={pickupClasses.Error}>{loadError || copy.genericError}</p>
        <p className={pickupClasses.HelpText}>
          {copy.contactHelp({ email: ORDER_CONTACT_EMAIL })}
        </p>
        {otherCodeLink}
      </section>
    );
  }

  const languageSwitch =
    session.language && session.language !== language ? (
      <p className={pickupClasses.HelpText}>
        <Link href={`${getRoutePath('invoicePayment', session.language)}/${code}`}>
          {copy.otherLanguage}
        </Link>
      </p>
    ) : null;

  if (session.status === 'paid') {
    return (
      <section className={pickupClasses.Card} aria-live="polite">
        <h2 className={classes.Heading}>{copy.paidHeading}</h2>
        <p>{copy.paidText}</p>
      </section>
    );
  }

  if (session.status !== 'open') {
    return (
      <section className={pickupClasses.Card} aria-live="polite">
        <p>{copy.unavailable}</p>
        <p className={pickupClasses.HelpText}>
          {copy.contactHelp({ email: ORDER_CONTACT_EMAIL })}
        </p>
        {languageSwitch}
      </section>
    );
  }

  return (
    <section className={pickupClasses.Card}>
      <h2 className={classes.Heading}>
        {copy.invoiceLabel({ invoiceNumber: session.invoiceNumber })}
      </h2>
      <dl className={classes.Details}>
        <div>
          <dt>{copy.amountLabel}</dt>
          <dd className={classes.Amount}>
            {formatAmount(session.amountCents, language)}
          </dd>
        </div>
        <div>
          <dt>{copy.dueDateLabel}</dt>
          <dd>{formatDate(session.dueDate, language)}</dd>
        </div>
        <div>
          <dt>{copy.codeLabel}</dt>
          <dd>{formatCode(code)}</dd>
        </div>
      </dl>
      {confirmSlow ? <p className={pickupClasses.HelpText}>{copy.confirmSlow}</p> : null}
      {payError ? (
        <p className={pickupClasses.Error} role="alert">
          {payError}
        </p>
      ) : null}
      <button
        className={pickupClasses.SubmitButton}
        type="button"
        onClick={handlePay}
        disabled={isOpening}
      >
        {isOpening ? copy.opening : copy.pay}
      </button>
      <p className={pickupClasses.HelpText}>{copy.payDetail}</p>
      {languageSwitch}
    </section>
  );
}
