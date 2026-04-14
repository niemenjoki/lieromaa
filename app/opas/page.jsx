import Advert from '@/components/Advert/Advert';
import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import GuideFeedbackBox from '@/components/GuideFeedbackBox/GuideFeedbackBox';
import PostPreview from '@/components/PostPreview/PostPreview';
import SafeLink from '@/components/SafeLink/SafeLink';
import { getAllContent } from '@/lib/content/index.mjs';
import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';
import { CONTENT_TYPES, GUIDE_CATEGORIES, SITE_URL } from '@/lib/site/constants.mjs';
import { createCollectionStructuredData } from '@/lib/structuredData/createCollectionStructuredData.mjs';

import classes from './GuideHubPage.module.css';
import { canonicalUrl, description, pageName } from './pageMetadata';

export { default as generateMetadata } from './generateMetadata';

const SHOW_FEATURED_GUIDES_SECTION = false;

const CATEGORY_SUMMARIES = {
  'kompostin hyödyntäminen':
    'Kun komposti alkaa tuottaa valmista tavaraa, tämä osio auttaa keräämään matokakan ja käyttämään sen hyödyksi kasveille.',
  'kompostorin perustaminen':
    'Aloita tästä, jos mietit millainen kompostori kannattaa valita, miten madot hankitaan ja mitä ensimmäisinä viikkoina pitää tehdä.',
  'kompostorin hoito':
    'Kun komposti on käynnissä, täältä löytyvät ruokinta, kosteuden hallinta, talvikäyttö ja tavallisimpien ongelmien ratkaisut.',
};

function slugifySegment(value) {
  return value.replaceAll(' ', '-');
}

function formatCategoryLabel(categoryName) {
  return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
}

function getGuideDate(guide) {
  return guide.updatedAt ?? guide.publishedAt ?? '';
}

function sortCategories(a, b) {
  const aIndex = GUIDE_CATEGORIES.indexOf(a);
  const bIndex = GUIDE_CATEGORIES.indexOf(b);

  if (aIndex === -1 && bIndex === -1) {
    return a.localeCompare(b, 'fi');
  }

  if (aIndex === -1) {
    return 1;
  }

  if (bIndex === -1) {
    return -1;
  }

  return aIndex - bIndex;
}

function sortGuidesForCategory(a, b) {
  if (a.category.pagePosition !== b.category.pagePosition) {
    return a.category.pagePosition - b.category.pagePosition;
  }

  return new Date(getGuideDate(b)) - new Date(getGuideDate(a));
}

export default function GuideHubPage() {
  const allGuides = getAllContent({ type: CONTENT_TYPES.GUIDE });
  const categories = Array.from(new Set(allGuides.map((guide) => guide.category.name)))
    .sort(sortCategories)
    .map((categoryName) => {
      const guides = allGuides
        .filter((guide) => guide.category.name === categoryName)
        .sort(sortGuidesForCategory);

      return {
        description:
          CATEGORY_SUMMARIES[categoryName] ??
          'Käytännön ohjeita matokompostoinnin seuraavaan vaiheeseen.',
        guides,
        name: categoryName,
        slug: slugifySegment(categoryName),
      };
    });

  const featuredGuides = SHOW_FEATURED_GUIDES_SECTION
    ? categories.map((category) => category.guides[0]).filter(Boolean)
    : [];
  const recentlyUpdatedGuides = [...allGuides]
    .sort((a, b) => new Date(getGuideDate(b)) - new Date(getGuideDate(a)))
    .slice(0, 3);
  const latestUpdatedGuide = recentlyUpdatedGuides[0];

  const structuredData = createCollectionStructuredData({
    pageUrl: `${SITE_URL}${canonicalUrl}`,
    pageName,
    description,
    breadcrumbItems: [
      { name: 'Etusivu', url: `${SITE_URL}/` },
      { name: 'Opas', url: `${SITE_URL}${canonicalUrl}` },
    ],
    itemListElement: categories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: formatCategoryLabel(category.name),
      url: `${SITE_URL}/opas/${category.slug}`,
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <div className={classes.Page}>
        <Breadcrumbs
          items={[
            { name: 'Etusivu', href: '/' },
            { name: 'Opas', href: canonicalUrl },
          ]}
        />

        <section className={classes.Hero}>
          <p className={classes.Eyebrow}>Lieromaan opas</p>
          <h1>Selkeä reitti matokompostoinnin aloittamisesta toimivaan arkeen</h1>
          <p className={classes.Intro}>
            {description} Selaa oppaat aihealueittain, aloita sinulle sopivasta
            lähtökohdasta ja siirry syvemmälle vasta silloin kun tarvitset lisää
            yksityiskohtia.
          </p>

          <div className={classes.HeroActions}>
            <SafeLink
              href={`/opas/${categories[0]?.slug ?? slugifySegment(GUIDE_CATEGORIES[0])}`}
              className={classes.PrimaryAction}
            >
              Aloita ensimmäisistä askelista
            </SafeLink>
            <a href="#aihealueet" className={classes.SecondaryAction}>
              Selaa aihealueita
            </a>
          </div>

          <div className={classes.StatsGrid}>
            <div className={classes.StatCard}>
              <span className={classes.StatValue}>{allGuides.length}</span>
              <p className={classes.StatLabel}>opasta yhdessä paikassa</p>
            </div>
            <div className={classes.StatCard}>
              <span className={classes.StatValue}>{categories.length}</span>
              <p className={classes.StatLabel}>
                pääaihetta aloituksesta kompostin tuotosten hyödyntämiseen
              </p>
            </div>
            <div className={classes.StatCard}>
              <span className={classes.StatValue}>
                {latestUpdatedGuide
                  ? formatFinnishDate(getGuideDate(latestUpdatedGuide))
                  : '-'}
              </span>
              <p className={classes.StatLabel}>viimeisin oppaan päivitys</p>
            </div>
          </div>
        </section>

        <section id="aihealueet" className={classes.Section}>
          <div className={classes.SectionHeading}>
            <h2>Valitse aihealue</h2>
            <p>
              Jokainen aihealue kokoaa samaan paikkaan ne oppaat, jotka kannattaa lukea
              yhdessä. Jos olet vasta aloittamassa, etene vasemmalta oikealle.
            </p>
          </div>

          <div className={classes.CategoryGrid}>
            {categories.map((category) => (
              <article key={category.slug} className={classes.CategoryCard}>
                <div className={classes.CategoryMeta}>
                  <span className={classes.CategoryCount}>
                    {category.guides.length} opasta
                  </span>
                </div>

                <h3>{formatCategoryLabel(category.name)}</h3>
                <p>{category.description}</p>

                <SafeLink
                  href={`/opas/${category.slug}`}
                  className={classes.CategoryAction}
                >
                  Avaa aihealue
                </SafeLink>
              </article>
            ))}
          </div>
        </section>

        <GuideFeedbackBox
          title="Puuttuuko oppaasta aihe?"
          description="Voit ehdottaa uutta opasta tai kysyä asiasta, johon et vielä löytänyt vastausta. Näiden viestien perusteella päätän myös, mitä aiheita oppaaseen kannattaa kirjoittaa seuraavaksi."
          sourceContext="opas-hub"
          pageTitle={pageName}
          defaultType="idea"
        />

        {SHOW_FEATURED_GUIDES_SECTION ? (
          <section className={classes.Section}>
            <div className={classes.SectionHeading}>
              <h2>Suositellut aloitusoppaat</h2>
              <p>
                Nämä oppaat avaavat jokaisen pääaiheen nopeimmin. Ne ovat hyvä reitti
                silloin, kun haluat päästä liikkeelle ilman että luet kaikkea kerralla.
              </p>
            </div>

            <div className={classes.FeaturedGrid}>
              {featuredGuides.map((guide) => (
                <PostPreview
                  key={guide.slug}
                  post={guide}
                  overrideHref={`/opas/${slugifySegment(guide.category.name)}/${guide.slug}`}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className={classes.Section}>
          <div className={classes.SectionHeading}>
            <h2>Viimeksi päivitetyt oppaat</h2>
            <p>
              Täältä näet nopeimmin, mitä on tarkennettu tai laajennettu viime aikoina.
            </p>
          </div>

          <div className={classes.RecentGrid}>
            {recentlyUpdatedGuides.map((guide) => (
              <article key={guide.slug} className={classes.RecentCard}>
                <div className={classes.RecentMeta}>
                  <span className={classes.RecentLabel}>
                    Päivitetty {formatFinnishDate(getGuideDate(guide))}
                  </span>
                  <span className={classes.RecentLabel}>
                    {formatCategoryLabel(guide.category.name)}
                  </span>
                </div>

                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
                <SafeLink
                  href={`/opas/${slugifySegment(guide.category.name)}/${guide.slug}`}
                  className={classes.RecentAction}
                >
                  Lue opas
                </SafeLink>
              </article>
            ))}
          </div>
        </section>

        <Advert />
      </div>
    </>
  );
}
