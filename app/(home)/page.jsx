import Post from '@/components/PostPreview/PostPreview';
import SafeLink from '@/components/SafeLink/SafeLink';
import { CONTENT_TYPES, GUIDE_CATEGORIES } from '@/data/site/constants.mjs';
import { getAllContent } from '@/lib/content/index.mjs';

import classes from './HomePage.module.css';
import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

const CATEGORY_SUMMARIES = {
  'kompostin hyödyntäminen': {
    actionLabel: 'Hyödynnä kompostin tuotokset',
    description:
      'Opi keräämään matokakka talteen ja käyttämään kompostin tuotoksia kasveille ilman arvailua.',
  },
  'kompostorin perustaminen': {
    actionLabel: 'Katso aloitusoppaat',
    description:
      'Aloita kompostorin valinnasta, matojen hankinnasta ja ensimmäisistä viikoista selkeässä järjestyksessä.',
  },
  'kompostorin hoito': {
    actionLabel: 'Ratkaise yleisiä ongelmia',
    description:
      'Saat apua ruokintaan, kosteuteen, hajuihin, talvikäyttöön ja kompostorin tasapainottamiseen.',
  },
};

function slugifySegment(value) {
  return value.replaceAll(' ', '-');
}

function formatCategoryLabel(categoryName) {
  return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
}

export default function HomePage() {
  const allGuides = getAllContent({ type: CONTENT_TYPES.GUIDE });
  const posts = getAllContent({ type: CONTENT_TYPES.POST }).slice(0, 3);

  const startPaths = GUIDE_CATEGORIES.map((categoryName) => {
    const guides = allGuides.filter((guide) => guide.category.name === categoryName);

    if (!guides.length) {
      return null;
    }

    return {
      actionLabel: CATEGORY_SUMMARIES[categoryName]?.actionLabel ?? 'Avaa aihealue',
      description:
        CATEGORY_SUMMARIES[categoryName]?.description ??
        'Käytännön ohjeita matokompostoinnin seuraavaan vaiheeseen.',
      guideCount: guides.length,
      name: formatCategoryLabel(categoryName),
      slug: slugifySegment(categoryName),
    };
  }).filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <div className={classes.Page}>
        <section className={classes.Hero}>
          <p className={classes.Eyebrow}>Lieromaa</p>
          <h1>Kompostimadot ja matokompostointi kotona</h1>
          <p className={classes.Intro}>
            Lieromaa auttaa suomalaisia aloittamaan matokompostoinnin, hoitamaan
            kompostoria arjessa ja hyödyntämään sen tuotokset. Täältä löydät myös
            kompostimadot omaan matokompostoriisi.
          </p>

          <div className={classes.HeroActions}>
            <SafeLink
              href="/opas/kompostorin-perustaminen"
              className={classes.PrimaryAction}
            >
              Aloitusoppaat
            </SafeLink>
            <SafeLink href="/tuotteet/madot" className={classes.SecondaryAction}>
              Osta kompostimatoja
            </SafeLink>
          </div>
        </section>

        <section className={classes.Section}>
          <div className={classes.SectionHeading}>
            <h2>Valitse aihealue</h2>
            <p>
              Jos olet vasta aloittamassa, aloita perustamisesta. Jos kompostori on jo
              käytössä, siirry hoitoon tai tuotosten hyödyntämiseen.
            </p>
          </div>

          <div className={classes.CategoryGrid}>
            {startPaths.map((path) => (
              <article key={path.slug} className={classes.CategoryCard}>
                <div className={classes.CategoryMeta}>
                  <span className={classes.CategoryCount}>{path.guideCount} opasta</span>
                </div>
                <h3>{path.name}</h3>
                <p>{path.description}</p>
                <SafeLink href={'/opas/' + path.slug} className={classes.CategoryAction}>
                  {path.actionLabel}
                </SafeLink>
              </article>
            ))}
          </div>
        </section>

        <section className={classes.Section}>
          <div className={classes.SectionHeading}>
            <h2>Etkö teidä kuinka paljon matoja tarvitset aloittaaksesi?</h2>
            <p>
              Matolaskuri auttaa arvioimaan sopivan aloitusmäärän kotitaloutesi koon ja
              ruokavalion perusteella.
            </p>
          </div>

          <div className={classes.ActionRow}>
            <SafeLink href="/matolaskuri" className={classes.PrimaryAction}>
              Avaa matolaskuri
            </SafeLink>
            <SafeLink
              href="/tuotteet/madot"
              className={classes.SecondaryAction}
              prefetch={false}
            >
              Osta kompostimatoja
            </SafeLink>
          </div>
        </section>

        <section className={classes.Section}>
          <div className={classes.SectionHeading}>
            <h2>Viimeisimmät blogijulkaisut</h2>
            <p>
              Blogissa jaan kokeiluja, havaintoja ja käytännön kokemuksia, jotka tukevat
              oppaita.
            </p>
          </div>

          <div className={classes.PostList}>
            {posts.map((post) => (
              <Post key={post.slug} post={post} />
            ))}
          </div>

          <SafeLink href="/blogi" className={classes.PrimaryAction}>
            Siirry blogiin
          </SafeLink>
        </section>
      </div>
    </>
  );
}
