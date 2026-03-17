'use client';

// ✅ necessary in the App Router
import { useState } from 'react';

import useDebounce from '@/hooks/useDebounce';
import useToggle from '@/hooks/useToggle';

import Post from '../PostPreview/PostPreview.jsx';
import classes from './SearchPosts.module.css';

function normalizeSearchItem(item) {
  return {
    ...item,
    keywords: Array.isArray(item.keywords)
      ? item.keywords
      : item.keywords
        ? item.keywords.split(',')
        : [],
    tags: Array.isArray(item.tags) ? item.tags : item.tags ? item.tags.split(',') : [],
  };
}

const Search = ({ list, keys, placeholder, extraItems = [] }) => {
  const searchableItems = [...list, ...extraItems].map((item) =>
    normalizeSearchItem(item)
  );

  const [searchTerm, updateSearchTerm] = useState('');
  const [searchResults, updateSearchResults] = useState([]);
  const [searchResultsShown, toggleSearchResultsShown] = useToggle(false);

  useDebounce(() => search(searchTerm), 700, [searchTerm]);

  const search = async (pattern) => {
    if (!pattern || pattern.trim().length < 3) {
      updateSearchResults([]);
      toggleSearchResultsShown(false);
      return;
    }

    const { default: Fuse } = await import('fuse.js');
    const fuse = new Fuse(searchableItems, {
      includeScore: true,
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 3,
      keys,
    });

    const results = fuse.search(pattern);

    const relevantResultData = results
      .filter((r) => !r.score || r.score < 0.6)
      .slice(0, 3)
      .map((r) => r.item);

    updateSearchResults(relevantResultData);
    toggleSearchResultsShown(true);
  };

  const handleInput = (e) => {
    updateSearchTerm(e.target.value);
  };

  return (
    <div className={classes.Search}>
      <div className={classes.Label}>Etsi julkaisuja</div>
      <input
        onChange={handleInput}
        onFocus={() => toggleSearchResultsShown(true)}
        onBlur={() => {
          if (searchResults.length === 0) toggleSearchResultsShown(false);
        }}
        placeholder={placeholder}
        className={searchResultsShown ? classes.ResultsShown : undefined}
      />
      {searchResultsShown && (
        <div className={classes.Results}>
          <span
            className={classes.CloseButton}
            onClick={() => toggleSearchResultsShown(false)}
          >
            &times;
          </span>
          {searchResults.length > 0 ? (
            searchResults.map((result, i) => (
              <Post
                key={i}
                post={result}
                compact={true}
                overrideHref={result.overrideHref}
              />
            ))
          ) : (
            <div className={classes.NoResults}>Ei tuloksia haulle: {searchTerm}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
