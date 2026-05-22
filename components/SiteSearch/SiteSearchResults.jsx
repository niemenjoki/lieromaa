import SafeLink from '@/components/SafeLink/SafeLink';

import classes from './SiteSearch.module.css';

export default function SiteSearchResults({
  emptyMessage = 'Ei tuloksia.',
  onNavigate,
  results = [],
}) {
  if (!results.length) {
    return <p className={classes.Empty}>{emptyMessage}</p>;
  }

  return (
    <ul className={classes.ResultsList}>
      {results.map((result) => (
        <li key={result.id} className={classes.ResultItem}>
          <SafeLink
            href={result.href}
            className={classes.ResultLink}
            onClick={onNavigate}
          >
            <span className={classes.ResultMeta}>
              <span className={classes.TypeBadge}>{result.typeLabel}</span>
              {result.section ? <span>{result.section}</span> : null}
            </span>
            <span className={classes.ResultTitle}>{result.title}</span>
            <span className={classes.ResultDescription}>{result.description}</span>
          </SafeLink>
        </li>
      ))}
    </ul>
  );
}
