export const HOT_COMPOSTING_CATEGORY_NAME = 'lämpökompostointi';
export const HOT_COMPOSTING_CATEGORY_SLUG = 'lämpökompostointi';

export const HOT_COMPOSTING_GUIDES = [
  {
    slug: 'lampokompostori-ei-lampene',
  },
  {
    slug: 'lampokompostorin-ongelmat',
    symptomIndex: [
      { href: '#komposti-ei-lampene', label: 'Ei lämpene' },
      { href: '#markyys-ja-hajut', label: 'Märkyys ja hajut' },
      { href: '#pinta-nayttaa-kuivalta', label: 'Kuivuus' },
      { href: '#kompostori-tayttyy-nopeasti', label: 'Täyttyminen' },
      { href: '#kompostori-jaatyy', label: 'Jäätyminen' },
      { href: '#hyonteiset-ja-muu-nakyva-elama', label: 'Hyönteiset' },
      { href: '#jyrsijat', label: 'Jyrsijät' },
      { href: '#mahdollinen-kompostorivika', label: 'Kompostorivika' },
    ],
  },
  {
    slug: 'lampokompostorin-tyhjennys-ja-jalkikompostointi',
  },
];

export const HOT_COMPOSTING_GUIDE_SLUGS = HOT_COMPOSTING_GUIDES.map(({ slug }) => slug);

export function getHotCompostingGuide(slug) {
  return HOT_COMPOSTING_GUIDES.find((guide) => guide.slug === slug) ?? null;
}
