'use client';

import { useState } from 'react';

import { ORDER_EMAIL_FALLBACK } from '@/lib/copy/orderMessages';
import { buildOrderEmailDraft } from '@/lib/orders/orderEmailDraft';

import classes from './OrderEmailFallback.module.css';

export default function OrderEmailFallback({ language = 'fi', ...order }) {
  const copy = ORDER_EMAIL_FALLBACK[language] || ORDER_EMAIL_FALLBACK.fi;
  const draft = buildOrderEmailDraft({ ...order, language });
  const [copyResult, setCopyResult] = useState(null);

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft.text);
      setCopyResult({ text: draft.text, message: copy.copied });
    } catch {
      setCopyResult({ text: draft.text, message: copy.copyFailed });
    }
  };

  return (
    <div className={classes.Fallback}>
      <p role="alert">{copy.unavailable}</p>
      <p>
        {copy.recipient}: {draft.to}
      </p>
      <label className={classes.Draft}>
        <span>{copy.draft}</span>
        <textarea readOnly rows={14} value={draft.text} />
      </label>
      <div className={classes.Actions}>
        <a href={draft.href}>{copy.send}</a>
        <button type="button" onClick={copyDraft}>
          {copy.copy}
        </button>
      </div>
      <p role="status">{copyResult?.text === draft.text ? copyResult.message : ''}</p>
    </div>
  );
}
