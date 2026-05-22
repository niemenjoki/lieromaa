'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Icon from '@/components/Icon/Icon';
import SafeLink from '@/components/SafeLink/SafeLink';
import { normalizeSearchQuery } from '@/lib/search/searchQuery.mjs';

import classes from './SiteSearch.module.css';
import SiteSearchResults from './SiteSearchResults';

const MIN_QUERY_LENGTH = 3;
const SEARCH_KEYS = [
  { name: 'title', weight: 0.45 },
  { name: 'description', weight: 0.25 },
  { name: 'keywords', weight: 0.25 },
  { name: 'tags', weight: 0.18 },
  { name: 'headings', weight: 0.2 },
  { name: 'section', weight: 0.12 },
  { name: 'searchText', weight: 0.08 },
];

function getSearchUrl(query) {
  const searchParams = new URLSearchParams();
  searchParams.set('q', query);
  return `/haku?${searchParams.toString()}`;
}

export default function SiteSearch({
  autoFocus = false,
  className = '',
  initialQuery = '',
  label = 'Hae sivustolta',
  onNavigate,
  placeholder = 'Hae oppaita, tuotteita tai aiheita',
  resultLimit = 5,
  searchItems = [],
  showAllLink = true,
  variant = 'inline',
}) {
  const [isOpen, setIsOpen] = useState(variant !== 'navbar');
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  const isNavbar = variant === 'navbar';
  const normalizedQuery = useMemo(() => normalizeSearchQuery(query), [query]);
  const canSearch = normalizedQuery.length >= MIN_QUERY_LENGTH;
  const searchHref = canSearch ? getSearchUrl(normalizedQuery) : '/haku';

  useEffect(() => {
    if (!initialQuery) return;
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!isOpen || !autoFocus) return;
    inputRef.current?.focus();
  }, [autoFocus, isOpen]);

  useEffect(() => {
    let isCurrent = true;

    async function runSearch() {
      if (!canSearch) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      const { default: Fuse } = await import('fuse.js');
      const fuse = new Fuse(searchItems, {
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: MIN_QUERY_LENGTH,
        threshold: 0.4,
        keys: SEARCH_KEYS,
      });

      const nextResults = fuse
        .search(normalizedQuery)
        .filter((result) => result.score == null || result.score < 0.62)
        .slice(0, resultLimit)
        .map((result) => result.item);

      if (!isCurrent) return;
      setResults(nextResults);
      setHasSearched(true);
    }

    runSearch();

    return () => {
      isCurrent = false;
    };
  }, [canSearch, normalizedQuery, resultLimit, searchItems]);

  const submitSearch = (event) => {
    event.preventDefault();
    if (!canSearch) return;

    window.location.assign(searchHref);
  };

  const openNavbarSearch = () => {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const closeNavbarSearch = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  const handleNavigate = () => {
    onNavigate?.();
    if (isNavbar) {
      closeNavbarSearch();
    }
  };

  return (
    <div
      className={`${classes.SiteSearch} ${classes[`Variant_${variant}`]} ${className}`}
    >
      {isNavbar && !isOpen ? (
        <button
          type="button"
          className={classes.IconButton}
          aria-label={label}
          onClick={openNavbarSearch}
        >
          <Icon name="search" aria-hidden="true" />
        </button>
      ) : (
        <div className={classes.SearchPanel}>
          <form className={classes.Form} role="search" onSubmit={submitSearch}>
            <label className={classes.Label} htmlFor={`site-search-${variant}`}>
              {label}
            </label>
            <div className={classes.InputWrap}>
              <Icon name="search" className={classes.InputIcon} aria-hidden="true" />
              <input
                ref={inputRef}
                id={`site-search-${variant}`}
                type="search"
                value={query}
                placeholder={placeholder}
                onChange={(event) => setQuery(event.target.value)}
                className={classes.Input}
              />
              {isNavbar ? (
                <button
                  type="button"
                  className={classes.CloseButton}
                  aria-label="Sulje haku"
                  onClick={closeNavbarSearch}
                >
                  <Icon name="close" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </form>

          {(hasSearched || canSearch) && (
            <div className={classes.ResultsPanel}>
              <SiteSearchResults
                results={results}
                emptyMessage={`Ei tuloksia haulle "${normalizedQuery}".`}
                onNavigate={handleNavigate}
              />
              {showAllLink && canSearch ? (
                <SafeLink href={searchHref} className={classes.AllResultsLink}>
                  Näytä kaikki tulokset
                </SafeLink>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
