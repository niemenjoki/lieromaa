'use client';

import { useId, useMemo, useState } from 'react';

import SafeLink from '@/components/SafeLink/SafeLink';

import classes from './GuideDiscovery.module.css';

const ALL_CATEGORIES = 'all';

function normalizeSearchValue(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/\p{Mark}+/gu, '')
    .toLocaleLowerCase('fi-FI')
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function formatResultCount(count, total) {
  if (count === total) return `Näytetään kaikki ${total} opasta`;
  if (count === 1) return `Näytetään 1 opas ${total} oppaasta`;
  return `Näytetään ${count} opasta ${total} oppaasta`;
}

export default function GuideDiscovery({
  categories = [],
  guides = [],
  initialCategory = ALL_CATEGORIES,
}) {
  const generatedId = useId().replaceAll(':', '');
  const countId = `guide-count-${generatedId}`;
  const resultsHeadingId = `guide-results-heading-${generatedId}`;
  const resultsId = `guide-results-${generatedId}`;
  const searchId = `guide-search-${generatedId}`;
  const initialActiveCategory = categories.some(
    (category) => category.name === initialCategory
  )
    ? initialCategory
    : ALL_CATEGORIES;
  const [activeCategory, setActiveCategory] = useState(initialActiveCategory);
  const [query, setQuery] = useState('');

  const searchableGuides = useMemo(
    () =>
      guides.map((guide) => ({
        ...guide,
        normalizedSearchText: normalizeSearchValue(
          [
            guide.title,
            guide.description,
            guide.category,
            guide.categoryLabel,
            ...(guide.keywords ?? []),
          ].join(' ')
        ),
      })),
    [guides]
  );

  const visibleGuides = useMemo(() => {
    const queryTerms = normalizeSearchValue(query).split(' ').filter(Boolean);

    return searchableGuides.filter((guide) => {
      const matchesCategory =
        activeCategory === ALL_CATEGORIES || guide.category === activeCategory;
      const matchesQuery = queryTerms.every((term) =>
        guide.normalizedSearchText.includes(term)
      );

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, searchableGuides]);

  const hasActiveFilters = activeCategory !== ALL_CATEGORIES || query.trim() !== '';
  const activeCategoryLabel = categories.find(
    (category) => category.name === activeCategory
  )?.label;

  const clearFilters = () => {
    setActiveCategory(ALL_CATEGORIES);
    setQuery('');
  };

  return (
    <section className={classes.Discovery} aria-labelledby={resultsHeadingId}>
      <div className={classes.Controls} role="search" aria-label="Hae ja rajaa oppaita">
        <div className={classes.SearchField}>
          <label htmlFor={searchId}>Hae oppaista</label>
          <input
            id={searchId}
            type="search"
            value={query}
            placeholder="Esimerkiksi ruokinta, kosteus tai matokakka"
            autoComplete="off"
            aria-controls={resultsId}
            aria-describedby={countId}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <fieldset className={classes.CategoryFilter}>
          <legend>Aihealue</legend>
          <div className={classes.Chips}>
            <button
              type="button"
              className={`${classes.Chip} ${activeCategory === ALL_CATEGORIES ? classes.ActiveChip : ''}`}
              aria-pressed={activeCategory === ALL_CATEGORIES}
              aria-controls={resultsId}
              onClick={() => setActiveCategory(ALL_CATEGORIES)}
            >
              Kaikki <span>{guides.length}</span>
            </button>
            {categories.map((category) => {
              const isActive = activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  className={`${classes.Chip} ${isActive ? classes.ActiveChip : ''}`}
                  aria-pressed={isActive}
                  aria-controls={resultsId}
                  onClick={() => setActiveCategory(category.name)}
                >
                  {category.label} <span>{category.count}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className={classes.ResultsHeader}>
        <div>
          <p className={classes.Kicker}>Opaskokoelma</p>
          <h2 id={resultsHeadingId}>
            {activeCategoryLabel ? `Oppaat: ${activeCategoryLabel}` : 'Kaikki oppaat'}
          </h2>
        </div>
        <div className={classes.ResultsMeta}>
          <p
            id={countId}
            className={classes.ResultCount}
            aria-live="polite"
            aria-atomic="true"
          >
            {formatResultCount(visibleGuides.length, guides.length)}
          </p>
          {hasActiveFilters ? (
            <button type="button" className={classes.ClearButton} onClick={clearFilters}>
              Tyhjennä rajaukset
            </button>
          ) : null}
        </div>
      </div>

      {visibleGuides.length ? (
        <ul id={resultsId} className={classes.Results} aria-labelledby={resultsHeadingId}>
          {visibleGuides.map((guide) => (
            <li key={guide.href} className={classes.Result}>
              <article>
                <div className={classes.ResultMeta}>
                  <span>{guide.categoryLabel}</span>
                  <time dateTime={guide.date}>{guide.dateLabel}</time>
                </div>
                <h3>
                  <SafeLink href={guide.href}>{guide.title}</SafeLink>
                </h3>
                <p>{guide.description}</p>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div id={resultsId} className={classes.EmptyResult}>
          <h3>Oppaita ei löytynyt</h3>
          <p>Kokeile toista hakusanaa tai poista aihealueen rajaus.</p>
          <button type="button" className={classes.ClearButton} onClick={clearFilters}>
            Näytä kaikki oppaat
          </button>
        </div>
      )}
    </section>
  );
}
