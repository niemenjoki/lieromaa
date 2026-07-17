import SafeLink from '@/components/SafeLink/SafeLink';
import { getMessage } from '@/lib/i18n/messages.mjs';

import classes from './FinnishContentLinks.module.css';

export default function FinnishContentLinks({ compact = false }) {
  const copy = getMessage('en', 'pages.moreInFinnish');

  return (
    <section className={`${classes.Section} ${compact ? classes.Compact : ''}`}>
      <div>
        <h2>{copy.heading}</h2>
        <p>{copy.description}</p>
      </div>
      <div className={classes.Grid}>
        <SafeLink href="/opas?from=en" lang="fi" className={classes.Card}>
          <span>{copy.guidesLabel}</span>
          <span className={classes.Badge}>{copy.badge}</span>
        </SafeLink>
        <SafeLink href="/blogi?from=en" lang="fi" className={classes.Card}>
          <span>{copy.blogLabel}</span>
          <span className={classes.Badge}>{copy.badge}</span>
        </SafeLink>
      </div>
    </section>
  );
}
