import Post from '@/components/PostPreview/PostPreview';
import SafeLink from '@/components/SafeLink/SafeLink';
import { getAllContent } from '@/lib/content/index.mjs';
import { CONTENT_TYPES, GUIDE_CATEGORIES } from '@/lib/site/constants.mjs';

import classes from './HomePage.module.css';
import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

const CATEGORY_SUMMARIES = {
  'kompostin hyödyntäminen': {
    actionLabel: 'Selaa hyödyntämisoppaita',
    description:
      'Opi keräämään matokakka talteen ja käyttämään kompostin tuotoksia kasveille ilman arvailua.',
  },
  'kompostorin perustaminen': {
    actionLabel: 'Selaa perustamisoppaita',
    description:
      'Aloita kompostorin valinnasta, matojen hankinnasta ja ensimmäisistä viikoista selkeässä järjestyksessä.',
  },
  'kompostorin hoito': {
    actionLabel: 'Selaa hoito-oppaita',
    description:
      'Saat apua ruokintaan, kosteuteen, hajuihin, talvikäyttöön ja kompostorin tasapainottamiseen.',
  },
};

const EDITORIAL_HIGHLIGHT_SPECS = [
  {
    eyebrow: 'Aloita tästä',
    slug: 'mika-on-matokompostointi-miksi-se-kannattaa',
  },
  {
    eyebrow: 'Perustaminen',
    slug: 'nain-perustat-oman-matokompostorin-vaihe-vaiheelta',
  },
  {
    eyebrow: 'Ruokinta',
    slug: 'mita-matokompostoriin-saa-laittaa-mita-ei-saa',
  },
  {
    eyebrow: 'Vianetsintä',
    slug: 'matokomposti-haisee-syyt-tehokkaat-ratkaisut',
  },
  {
    eyebrow: 'Hyödyntäminen',
    slug: 'milloin-matokomposti-on-valmista-miten-sita-kaytetaan',
  },
];

function slugifySegment(value) {
  return value.replaceAll(' ', '-');
}

function formatCategoryLabel(categoryName) {
  return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
}

function getGuideHref(guide) {
  return `/opas/${slugifySegment(guide.category.name)}/${guide.slug}`;
}

export default function HomePage() {
  const allGuides = getAllContent({ type: CONTENT_TYPES.GUIDE });
  const posts = getAllContent({ type: CONTENT_TYPES.POST }).slice(0, 3);
  const editorialHighlights = EDITORIAL_HIGHLIGHT_SPECS.map(({ eyebrow, slug }) => {
    const guide = allGuides.find((entry) => entry.slug === slug);

    if (!guide) {
      return null;
    }

    return {
      description: guide.description,
      eyebrow,
      href: getGuideHref(guide),
      title: guide.title,
    };
  }).filter(Boolean);

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
            kompostoria arjessa ja hyödyntämään sen tuotokset. Täältä löydät myös{' '}
            <SafeLink href="/tuotteet/madot" className={classes.InlineLink}>
              kotimaiset kompostimadot
            </SafeLink>
            ,{' '}
            <SafeLink
              href="/tuotteet/matokompostin-aloituspakkaus"
              className={classes.InlineLink}
            >
              matokompostorin aloituspakkauksen
            </SafeLink>{' '}
            sekä{' '}
            <SafeLink
              href="/tuotteet/kompostorin-kuituseos"
              className={classes.InlineLink}
            >
              kompostorin ylläpitoa helpottavan kuituseoksen
            </SafeLink>
            .
          </p>
        </section>

        <section className={classes.Section}>
          <div className={classes.SectionHeading}>
            <h2>Aloita näistä oppaista</h2>
            <p>
              Näissä oppaissa käydään läpi matokompostoinnin tärkeimmät vaiheet
              aloituksesta ruokintaan, hajuhaittojen ehkäisyyn ja valmiin kompostin
              käyttöön.
            </p>
          </div>

          <div className={classes.HighlightGrid}>
            {editorialHighlights.map((guide) => (
              <article key={guide.href} className={classes.HighlightCard}>
                <p className={classes.HighlightEyebrow}>{guide.eyebrow}</p>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
                <SafeLink href={guide.href} className={classes.CategoryAction}>
                  <span>Lue opas</span>
                  <span className={classes.ActionArrow} aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </SafeLink>
              </article>
            ))}
          </div>
        </section>

        <section className={classes.Section}>
          <div className={classes.SectionHeading}>
            <h2>Selaa oppaita aihealueittain</h2>
            <p>
              Oppaat on jaettu kolmeen aihealueeseen: perustaminen kokoaa yhteen
              aloitusvaiheen ohjeet, hoito auttaa arjen ongelmissa ja hyödyntäminen
              keskittyy valmiin kompostin käyttöön.
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
                  <span>{path.actionLabel}</span>
                  <span className={classes.ActionArrow} aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </SafeLink>
              </article>
            ))}
          </div>
        </section>

        <section className={classes.Section}>
          <div className={classes.SectionHeading}>
            <h2>Etkö tiedä kuinka paljon matoja tarvitset aloittaaksesi?</h2>
            <p>
              Matolaskuri auttaa arvioimaan taloudellesi sopivan matojen painon talouden
              koon ja ruokavalion perusteella. Jos haluat valmiin kokonaisuuden, tutustu
              myös{' '}
              <SafeLink
                href="/tuotteet/matokompostin-aloituspakkaus"
                className={classes.InlineLink}
              >
                matokompostorin aloituspakkaukseen
              </SafeLink>
              .
            </p>
          </div>

          <div className={classes.ActionRow}>
            <SafeLink href="/matolaskuri" className={classes.PrimaryAction}>
              Avaa matolaskuri
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
