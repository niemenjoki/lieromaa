import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getBlogTagPageData,
  isValidPageIndex,
} from '@/lib/content/getCollectionPageData.mjs';

test('blog page index accepts only positive page numbers without leading zeros', () => {
  for (const value of ['1', '2', '10', '123']) {
    assert.equal(isValidPageIndex(value), true, value);
  }
  for (const value of ['abc', '0', '01', '-1', '1.5', '2abc', '', ' 2', undefined]) {
    assert.equal(isValidPageIndex(value), false, String(value));
  }
});

test('blog tag page data survives a malformed percent encoding', () => {
  const pageData = getBlogTagPageData({ tag: 'abc%E0%A4%A', pageIndex: '1' });
  assert.equal(pageData.tagSlug, 'abc%E0%A4%A');

  assert.equal(
    getBlogTagPageData({ tag: 'kompostointi', pageIndex: '1' }).tagSlug,
    'kompostointi'
  );
});
