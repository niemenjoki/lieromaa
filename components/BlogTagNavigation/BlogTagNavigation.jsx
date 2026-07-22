import SafeLink from '@/components/SafeLink/SafeLink';
import { getBlogTagSlug } from '@/lib/content/getBlogTagArchives.mjs';

import classes from './BlogTagNavigation.module.css';

export default function BlogTagNavigation({ activeTagSlug, tags = [] }) {
  const normalizedActiveTag = activeTagSlug?.toLocaleLowerCase('fi-FI') ?? null;

  return (
    <nav className={classes.Navigation} aria-label="Rajaa blogijulkaisuja avainsanalla">
      <ul className={classes.List}>
        <li>
          <SafeLink
            href="/blogi"
            className={`${classes.Link} ${normalizedActiveTag == null ? classes.ActiveLink : ''}`}
            aria-current={normalizedActiveTag == null ? 'page' : undefined}
          >
            Kaikki
          </SafeLink>
        </li>
        {tags.map((tag) => {
          const slug = getBlogTagSlug(tag);
          const isActive = slug === normalizedActiveTag;

          return (
            <li key={slug}>
              <SafeLink
                href={`/blogi/${slug}/sivu/1`}
                className={`${classes.Link} ${isActive ? classes.ActiveLink : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {tag}
              </SafeLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
