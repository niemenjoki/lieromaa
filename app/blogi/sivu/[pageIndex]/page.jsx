import Link from 'next/link';

import Advert from '@/components/Advert/Advert';
import Pagination from '@/components/Pagination/Pagination';
import Post from '@/components/PostPreview/PostPreview';
import SearchPosts from '@/components/SearchPosts/SearchPosts';
import { POSTS_PER_PAGE } from '@/data/vars';
import { SITE_URL } from '@/data/vars';
import { getAllPostSlugs, getAllTags, getPaginatedPosts } from '@/lib/posts';

import classes from './PostPage.module.css';

export const metadata = {
  title: 'Lieromaa – Kompostimadot ja matokompostointi kotona',
  alternates: {
    canonical: `${SITE_URL}`,
  },
  description:
    'Matokompostointi kotona on helppoa! Tilaa kotimaiset kompostimadot (Eisenia fetida) ja tutustu käytännön oppaisiin ja kompostointivinkkeihin.',
  openGraph: {
    type: 'website',
    url: 'https://www.lieromaa.fi',
    title: 'Lieromaa – Kompostimadot ja matokompostointi kotona',
    description:
      'Matokompostointi kotona on helppoa! Tilaa kotimaiset kompostimadot (Eisenia fetida) ja tutustu käytännön oppaisiin ja kompostointivinkkeihin.',
    siteName: 'Lieromaa',
    images: [
      {
        url: 'https://www.lieromaa.fi/images/luomuliero_logo_1024.png',
        width: 1024,
        height: 1024,
        alt: 'Lieromaa logo',
      },
    ],
    locale: 'fi_FI',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lieromaa',
    images: ['https://www.lieromaa.fi/images/luomuliero_logo_1024.png'],
  },
  icons: {
    icon: '/icons/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();

  const numPages = Math.ceil(slugs.length / POSTS_PER_PAGE);
  return Array.from({ length: numPages }, (_, i) => ({
    pageIndex: (i + 1).toString(),
  }));
}

export default async function BlogPage({ params }) {
  const { pageIndex } = await params;

  const pageIndexInt = parseInt(pageIndex) || 1;
  const { posts, numPages } = getPaginatedPosts(pageIndexInt, POSTS_PER_PAGE);
  const allTags = getAllTags();

  return (
    <>
      {pageIndexInt === 1 ? (
        <section className={classes.LandingInfo}>
          <h1>Lieromaa - Kompostimadot ja matokompostointi kotona</h1>
          <p>
            Lieromaa on suomalainen blogi ja kompostimatojen verkkokauppa, joka keskittyy
            matokompostointiin sekä ajoittain muihin kompostointimenetelmiin ja kestävän
            kehityksen aiheisiin. Kasvatan Järvenpäässä <strong>Eisenia fetida</strong>{' '}
            -kompostimatoja ja toimitan niitä postitse kaikkialle Suomeen.
          </p>
          <p>
            Matokompostointi on helppo ja hajuton tapa muuttaa biojäte ravinteikkaaksi
            mullaksi ympäri vuoden. Sivustolta löydät selkeät ohjeet oman matokompostorin
            rakentamiseen, hoitoon ja valmiin matokakan keräämiseen sekä hyödyntämiseen.
          </p>
          <p>
            Tutustu blogiin valitsemalla alta sinua kiinnostava kategoria – tai{' '}
            <Link href="/madot" style={{ fontWeight: 'bold' }}>
              tilaa kompostimatoja
            </Link>{' '}
            ja aloita oma matokompostointi jo tänään.
          </p>
        </section>
      ) : (
        <h1>Lieromaa – Kompostimadot ja matokompostointi kotona</h1>
      )}

      <aside
        className={classes.Content}
        style={{
          border: '2px solid var(--highlight)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          backgroundColor: 'var(--background-4)',
        }}
      >
        <h3 style={{ marginTop: 0, color: 'var(--highlight-alt)' }}>Syystarjous 🍂</h3>
        <p style={{ marginBottom: '0.5rem' }}>
          Ilmainen toimitus kaikille kompostimadoille koko Suomeen 30.11.2025 asti.
        </p>
        <Link
          href="/madot-kampanja"
          style={{ fontWeight: 'bold', color: 'var(--highlight-content-link)' }}
        >
          Katso kampanjasivu »
        </Link>
      </aside>

      <SearchPosts
        list={posts}
        keys={['title', 'excerpt', 'keywords', 'tags']}
        placeholder="Etsi julkaisun nimellä tai avainsanalla.."
      />

      <div className={classes.Taglist}>
        <Link href="/blogi" className={`${classes.Tag} ${classes.ActiveTag}`}>
          Kaikki
        </Link>
        {allTags.map((tag) => (
          <Link
            href={`/blogi/${tag.toLowerCase().replaceAll(' ', '-')}/sivu/1`}
            key={tag}
            className={classes.Tag}
          >
            {tag}
          </Link>
        ))}
      </div>
      <h2 style={{ color: 'var(--highlight-alt)', marginTop: '1rem' }}>
        Viimeisimmät julkaisut
      </h2>
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}

      <Pagination numPages={numPages} currentPage={pageIndexInt} />
      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
    </>
  );
}
