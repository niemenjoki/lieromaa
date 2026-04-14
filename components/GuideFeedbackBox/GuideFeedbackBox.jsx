'use client';

import { useId, useState } from 'react';

import { CONTACT_EMAIL, GUIDE_FEEDBACK_FORMSPREE_ENDPOINT } from '@/lib/site/contact';

import classes from './GuideFeedbackBox.module.css';

const FEEDBACK_TYPES = {
  idea: {
    fieldLabel: 'Aihe-ehdotus',
    placeholder:
      'Mistä aiheesta haluaisit uuden oppaan tai mitä nykyisestä oppaasta puuttuu?',
    submitLabel: 'Lähetä aihe-ehdotus',
    toggleLabel: 'Ehdota aihetta',
    valueLabel: 'Aihe-ehdotus',
  },
  question: {
    fieldLabel: 'Kysymys',
    placeholder: 'Mikä jäi epäselväksi tai mihin kaipaat vastausta?',
    submitLabel: 'Lähetä kysymys',
    toggleLabel: 'Kysy kysymys',
    valueLabel: 'Kysymys',
  },
};

export default function GuideFeedbackBox({
  title,
  description,
  sourceContext,
  pageTitle,
  defaultType = 'question',
}) {
  const initialType = FEEDBACK_TYPES[defaultType] ? defaultType : 'question';
  const [feedbackType, setFeedbackType] = useState(initialType);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const messageFieldId = useId();
  const emailFieldId = useId();

  const activeType = FEEDBACK_TYPES[feedbackType] ?? FEEDBACK_TYPES.question;

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmitError('');
    setMessage('');
    setEmail('');
    setFeedbackType(initialType);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setSubmitError('Kirjoita viesti ennen lähetystä.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const formData = new FormData(event.currentTarget);
    formData.set('viesti', trimmedMessage);
    formData.set('viestin_tyyppi', activeType.valueLabel);
    formData.set('sivu_konteksti', sourceContext);
    formData.set('sivun_otsikko', pageTitle);
    formData.set('sivu_url', window.location.href);
    formData.set('referrer', document.referrer || '');

    if (!email.trim()) {
      formData.delete('email');
    }

    try {
      const response = await fetch(GUIDE_FEEDBACK_FORMSPREE_ENDPOINT, {
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

  return (
    <section className={classes.Box} aria-live="polite">
      {!isSubmitted ? <h2>{title}</h2> : <h2>Kiitos viestistäsi</h2>}

      {!isSubmitted ? (
        <>
          <p className={classes.Description}>{description}</p>

          <div className={classes.IntentButtons}>
            {Object.entries(FEEDBACK_TYPES).map(([key, config]) => (
              <button
                key={key}
                type="button"
                aria-pressed={feedbackType === key}
                className={`${classes.IntentButton} ${
                  feedbackType === key
                    ? classes.IntentButtonActive
                    : classes.IntentButtonInactive
                }`}
                onClick={() => setFeedbackType(key)}
              >
                {config.toggleLabel}
              </button>
            ))}
          </div>

          <form
            action={GUIDE_FEEDBACK_FORMSPREE_ENDPOINT}
            method="POST"
            onSubmit={handleSubmit}
            className={classes.Form}
            data-analytics-form="guide-feedback"
          >
            <input
              type="text"
              name="_gotcha"
              className={classes.Gotcha}
              tabIndex="-1"
              autoComplete="off"
            />

            <label htmlFor={messageFieldId} className={classes.FieldLabel}>
              {activeType.fieldLabel}
            </label>
            <textarea
              id={messageFieldId}
              name="viesti"
              required
              rows="5"
              placeholder={activeType.placeholder}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={classes.Textarea}
            />

            <label htmlFor={emailFieldId} className={classes.FieldLabel}>
              Sähköposti (valinnainen)
            </label>
            <input
              id={emailFieldId}
              type="email"
              name="email"
              placeholder="Jos haluat vastauksen sähköpostitse"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={classes.Input}
            />

            {submitError ? <p className={classes.Error}>{submitError}</p> : null}

            <div className={classes.Actions}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={classes.SubmitButton}
              >
                {isSubmitting ? 'Lähetetään...' : activeType.submitLabel}
              </button>
            </div>
          </form>

          <p className={classes.HelpText}>
            Voit myös lähettää viestin sähköpostilla osoitteeseen{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </>
      ) : (
        <>
          <p className={classes.Description}>
            Luen kaikki viestit. Jos jätit sähköpostiosoitteesi, vastaan sinulle
            mahdollisimman pian.
          </p>
          <div className={classes.Actions}>
            <button type="button" className={classes.ResetButton} onClick={resetForm}>
              Lähetä toinen viesti
            </button>
          </div>
        </>
      )}
    </section>
  );
}
