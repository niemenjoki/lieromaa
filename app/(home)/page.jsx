import Post from '@/components/PostPreview/PostPreview';
import PromoBox from '@/components/PromoBox/Promobox';
import SafeLink from '@/components/SafeLink/SafeLink';
import { CONTENT_TYPES } from '@/data/vars.mjs';
import { getAllContent } from '@/lib/content/index.mjs';

import classes from './HomePage.module.css';
import structuredData from './structuredData.json';

export { default as generateMetadata } from './generateMetadata';

export default async function HomePage() {
  const posts = getAllContent({ type: CONTENT_TYPES.POST }).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <section className={classes.Hero}>
        <h1>Lieromaa – Kompostimadot ja matokompostointi kotona</h1>
        <p>
          Lieromaa auttaa suomalaisia muuttamaan biojätteen arvokkaaksi mullaksi. Kasvatan
          ja myyn <strong>Eisenia fetida</strong> -kompostimatoja sekä kirjoitan ohjeita
          matokompostoinnin aloittamiseen, hoitoon ja sen tuotosten hyödyntämiseen
          liittyen.
        </p>
        <div className={classes.ButtonLinks}>
          <SafeLink href="/tuotteet/madot" className={classes.ButtonLink}>
            Tilaa kompostimatoja
          </SafeLink>
          <SafeLink
            href="/opas/kompostorin-perustaminen"
            className={classes.ButtonLinkAlt}
          >
            Kompostorin perustaminen
          </SafeLink>
        </div>
      </section>
      <PromoBox>
        <h3 style={{ marginTop: 0, color: 'var(--highlight-alt)' }}>Syystarjous 🍂</h3>
        <p style={{ marginBottom: '0.5rem' }}>
          Ilmainen toimitus kompostimadoille koko Suomeen 30.11.2025 asti.
        </p>
        <SafeLink
          href="/tuotteet/madot-kampanja"
          style={{ fontWeight: 'bold', color: 'var(--highlight-content-link)' }}
        >
          Katso kampanjasivu »
        </SafeLink>
      </PromoBox>
      <section className={classes.Section}>
        <h2>Viimeisimmät blogijulkaisut</h2>
        {posts.map((post) => (
          <Post key={post.slug} post={post} />
        ))}
        <SafeLink href="/blogi" className={classes.ButtonLink}>
          Siirry blogiin »
        </SafeLink>
      </section>
    </>
  );
}
