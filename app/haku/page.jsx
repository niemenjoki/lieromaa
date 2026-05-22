import SiteSearch from '@/components/SiteSearch/SiteSearch';
import { getSiteSearchIndex } from '@/lib/search/siteSearchIndex.mjs';

import classes from './HakuPage.module.css';

export const metadata = {
  title: 'Haku | Lieromaa',
  description:
    'Hae Lieromaan oppaita, tuotteita, blogijulkaisuja ja matokompostointiin liittyviä aiheita.',
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === 'string' ? params.q : '';
  const searchItems = getSiteSearchIndex();

  return (
    <div className={classes.Page}>
      <h1>Haku</h1>
      <p className={classes.Intro}>
        Hae Lieromaan oppaita, tuotteita ja blogijulkaisuja esimerkiksi aiheen, ongelman
        tai tuotteen nimellä.
      </p>
      <SiteSearch
        searchItems={searchItems}
        initialQuery={query}
        variant="page"
        resultLimit={12}
        showAllLink={false}
        autoFocus
      />
    </div>
  );
}
