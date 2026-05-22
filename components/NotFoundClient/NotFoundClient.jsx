'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import Fuse from 'fuse.js';

import SafeLink from '@/components/SafeLink/SafeLink';
import SiteSearchResults from '@/components/SiteSearch/SiteSearchResults';
import {
  createPathSearchQuery,
  isProductLikeSearchQuery,
} from '@/lib/search/searchQuery.mjs';

import classes from './NotFoundClient.module.css';

const RESULT_PRIORITY = {
  guide: 0,
  post: 1,
  guideHub: 2,
  tool: 3,
  page: 4,
  product: 5,
};

function prioritizeResults(results, query) {
  if (isProductLikeSearchQuery(query)) {
    return results;
  }

  return [...results].sort((a, b) => {
    const aPriority = RESULT_PRIORITY[a.type] ?? 10;
    const bPriority = RESULT_PRIORITY[b.type] ?? 10;

    return aPriority - bPriority;
  });
}

export default function ClientNotFoundPage({ searchItems }) {
  const pathname = usePathname();
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!pathname || !searchItems?.length) return;

    const nextQuery = createPathSearchQuery(pathname);
    setQuery(nextQuery);

    if (nextQuery.length < 3) {
      setResults([]);
      return;
    }

    const fuse = new Fuse(searchItems, {
      includeScore: true,
      minMatchCharLength: 3,
      ignoreLocation: true,
      keys: [
        { name: 'title', weight: 0.45 },
        { name: 'description', weight: 0.25 },
        { name: 'keywords', weight: 0.25 },
        { name: 'tags', weight: 0.18 },
        { name: 'headings', weight: 0.2 },
        { name: 'section', weight: 0.12 },
        { name: 'searchText', weight: 0.08 },
      ],
    });

    const matches = prioritizeResults(
      fuse
        .search(nextQuery)
        .filter((r) => r.score == null || r.score < 0.66)
        .slice(0, 6)
        .map((r) => r.item),
      nextQuery
    ).slice(0, 2);

    setResults(matches);
  }, [pathname, searchItems]);

  return (
    <>
      <div className={classes.Oops}>Hups!</div>
      <h1 className={classes.NotFoundPage}>
        Näyttää siltä, että etsimääsi sivua ei ole olemassa
      </h1>

      {results.length > 0 && (
        <section className={classes.Suggestions}>
          <div className={classes.Suggestion}>Ehkä tarkoitit näitä?</div>
          <div className={classes.Results}>
            <SiteSearchResults results={results} />
          </div>
        </section>
      )}

      <div className={classes.LinkWrapper}>
        <SafeLink href={query ? `/haku?q=${encodeURIComponent(query)}` : '/haku'}>
          Hae sivustolta
        </SafeLink>
        <SafeLink href="/opas">Siirry oppaisiin</SafeLink>
      </div>
    </>
  );
}
