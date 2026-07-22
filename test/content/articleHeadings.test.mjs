import assert from 'node:assert/strict';
import test from 'node:test';

import {
  extractArticleHeadings,
  slugifyArticleHeading,
} from '@/lib/content/articleHeadings.mjs';

test('article headings extracts only real second- and third-level Markdown headings', () => {
  const source = `# Page title

## First section
### Detail
#### Not included

\`\`\`md
## Heading inside a code fence
\`\`\`

~~~
### Another fenced heading
~~~
`;

  assert.deepEqual(extractArticleHeadings(source), [
    { id: 'first-section', level: 2, text: 'First section' },
    { id: 'detail', level: 3, text: 'Detail' },
  ]);
});

test('article headings creates readable, stable and unique IDs from inline Markdown', () => {
  const source = `## Käyttö & hoito
### **Käyttö & hoito**
## [Linkki](/opas) ja \`koodi\` ##
## Käyttö & hoito
`;

  assert.deepEqual(extractArticleHeadings(source), [
    { id: 'kaytto-ja-hoito', level: 2, text: 'Käyttö & hoito' },
    { id: 'kaytto-ja-hoito-2', level: 3, text: 'Käyttö & hoito' },
    { id: 'linkki-ja-koodi', level: 2, text: 'Linkki ja koodi' },
    { id: 'kaytto-ja-hoito-3', level: 2, text: 'Käyttö & hoito' },
  ]);

  assert.equal(
    slugifyArticleHeading('  Mistä matokakkaa saa?  '),
    'mista-matokakkaa-saa'
  );
});
