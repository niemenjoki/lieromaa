import { getHotCompostingGuide } from '@/lib/content/hotCompostingGuide.mjs';

import classes from './HotCompostingGuideNavigation.module.css';

export function HotCompostingSymptomIndex({ guideSlug }) {
  const guide = getHotCompostingGuide(guideSlug);

  if (!guide?.symptomIndex?.length) {
    return null;
  }

  const headingId = `guide-symptom-index-${guideSlug}`;

  return (
    <nav className={classes.SymptomIndex} aria-labelledby={headingId}>
      <p className={classes.Title} id={headingId}>
        Siirry oireeseen
      </p>
      <ul>
        {guide.symptomIndex.map((item) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
