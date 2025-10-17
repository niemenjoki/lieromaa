import Head from 'next/head';
import Link from 'next/link';

import { SITE_URL } from '@/data/vars';

import classes from './Pagination.module.css';

const Pagination = ({ numPages, currentPage }) => {
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;

  const previousPage = `/blogi/sivu/${currentPage - 1}`;
  const nextPage = `/blogi/sivu/${currentPage + 1}`;

  console.log({ numPages, currentPage, isFirst, isLast, previousPage, nextPage });

  if (numPages === 1) {
    return <></>;
  }
  return (
    <>
      <Head>
        {!isFirst && <link rel="prev" href={SITE_URL + previousPage} />}
        {!isLast && <link rel="next" href={SITE_URL + nextPage} />}
      </Head>
      <div className={classes.Pagination}>
        <ul>
          {!isFirst && (
            <li key={'previous'}>
              <Link href={previousPage} className={classes.TextButton}>
                Edellinen
              </Link>
            </li>
          )}
          {Array.from({ length: numPages }, (_, i) => (
            <li key={i}>
              <Link href={`/blogi/sivu/${i + 1}`} className={classes.NumberButton}>
                {i + 1}
              </Link>
            </li>
          ))}
          {!isLast && (
            <li key={'next'}>
              <Link href={nextPage} className={classes.TextButton}>
                Seuraava
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Pagination;
