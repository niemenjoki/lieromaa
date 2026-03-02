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
      <PromoBox>
        <strong>Uutta:</strong> Matokompostorin aloituspakkaus on nyt saatavilla. Saat
        valmiiksi kootun kolmen laatikon läpivirtauskompostorin, petimateriaalin ja
        kompostimadot samassa paketissa. Tutustu pakettiin ja tilaa{' '}
        <SafeLink
          href="/tuotteet/matokompostin-aloituspakkaus"
          style={{ color: 'var(--highlight-alt)', fontWeight: 600 }}
        >
          täällä
        </SafeLink>
      </PromoBox>
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
