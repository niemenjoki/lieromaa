import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import GuideDiscovery from '@/components/GuideDiscovery/GuideDiscovery';
import GuideFeedbackBox from '@/components/GuideFeedbackBox/GuideFeedbackBox';
import {
  compareGuideCategoryNames,
  getLatestGuide,
  orderGuidesForLibrary,
} from '@/lib/content/guideLibraryOrder.mjs';
import {
  getGuideCategoryLabel,
  getGuideCategorySlug,
  getGuidePath,
} from '@/lib/content/guideRoutes.mjs';
import { getAllContent } from '@/lib/content/index.mjs';
import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';

import classes from './GuideHubPage.module.css';

function getGuideDate(guide) {
  return guide.updatedAt ?? guide.publishedAt ?? '';
}

export function getGuideHubData() {
  const allGuides = getAllContent({ type: CONTENT_TYPES.GUIDE });
  const categoryNames = Array.from(
    new Set(allGuides.map((guide) => guide.category.name))
  ).sort(compareGuideCategoryNames);
  const categories = categoryNames.map((categoryName) => ({
    count: allGuides.filter((guide) => guide.category.name === categoryName).length,
    label: getGuideCategoryLabel(categoryName),
    name: categoryName,
    slug: getGuideCategorySlug(categoryName),
  }));
  const guides = orderGuidesForLibrary(allGuides).map((guide) => {
    const date = getGuideDate(guide);

    return {
      category: guide.category.name,
      categoryLabel: getGuideCategoryLabel(guide.category.name),
      date,
      dateLabel: `${guide.updatedAt ? 'Päivitetty' : 'Julkaistu'} ${formatFinnishDate(date)}`,
      description: guide.description,
      href: getGuidePath({
        categoryName: guide.category.name,
        guideSlug: guide.slug,
      }),
      keywords: guide.keywords ?? [],
      title: guide.title,
    };
  });

  const latestGuide = getLatestGuide(allGuides);

  return {
    categories,
    guides,
    latestUpdatedGuide: latestGuide ? { date: getGuideDate(latestGuide) } : null,
  };
}

export default function GuideHub({
  breadcrumbItems,
  data,
  description,
  eyebrow = 'Lieromaan opas',
  initialCategoryName,
  pageName,
  title,
}) {
  const { categories, guides, latestUpdatedGuide } = data;

  return (
    <div className={classes.Page}>
      <Breadcrumbs items={breadcrumbItems} />

      <header className={classes.Hero}>
        <p className={classes.Eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p className={classes.Intro}>{description}</p>

        <dl className={classes.StatsGrid}>
          <div className={classes.StatItem}>
            <dt>julkaistua opasta</dt>
            <dd>{guides.length}</dd>
          </div>
          <div className={classes.StatItem}>
            <dt>aihealuetta</dt>
            <dd>{categories.length}</dd>
          </div>
          <div className={classes.StatItem}>
            <dt>viimeisin päivitys</dt>
            <dd>
              {latestUpdatedGuide ? formatFinnishDate(latestUpdatedGuide.date) : '-'}
            </dd>
          </div>
        </dl>
      </header>

      <GuideDiscovery
        key={initialCategoryName ?? 'all-guides'}
        categories={categories}
        guides={guides}
        initialCategory={initialCategoryName}
      />

      <GuideFeedbackBox
        title="Puuttuuko oppaasta aihe?"
        description="Voit ehdottaa uutta opasta tai kysyä asiasta, johon et vielä löytänyt vastausta. Näiden viestien perusteella päätän myös, mitä aiheita opaskirjastoon kannattaa lisätä."
        sourceContext={initialCategoryName ? 'opas-category' : 'opas-hub'}
        pageTitle={pageName}
        defaultType="idea"
      />
    </div>
  );
}
