import Head from 'next/head';

import SafeLink from '@/components/SafeLink/SafeLink';
import { SITE_URL } from '@/data/vars';

import classes from './Pagination.module.css';

const Pagination = ({ numPages, currentPage }) => {
  const total = Number(numPages) || 1;
  const page = Number(currentPage) || 1;

  const isFirst = page === 1;
  const isLast = page === total;

  const previousPage = `/blogi/sivu/${page - 1}`;
  const nextPage = `/blogi/sivu/${page + 1}`;

  if (total === 1) return null;

  return (
    <>
      <Head>
        {!isFirst && <SafeLink rel="prev" href={SITE_URL + previousPage} />}
        {!isLast && <SafeLink rel="next" href={SITE_URL + nextPage} />}
      </Head>

      <div className={classes.Pagination}>
        <ul>
          {!isFirst && (
            <li key="previous">
              <SafeLink href={previousPage} className={classes.TextButton}>
                Edellinen
              </SafeLink>
            </li>
          )}

          {Array.from({ length: total }, (_, i) => {
            const pageNumber = i + 1;
            const isActive = pageNumber === page;

            return (
              <li key={pageNumber}>
                <SafeLink
                  href={`/blogi/sivu/${pageNumber}`}
                  className={`${classes.NumberButton} ${
                    isActive ? classes.ActiveButton : ''
                  }`}
                >
                  {pageNumber}
                </SafeLink>
              </li>
            );
          })}

          {!isLast && (
            <li key="next">
              <SafeLink href={nextPage} className={classes.TextButton}>
                Seuraava
              </SafeLink>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Pagination;
