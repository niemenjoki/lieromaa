import classes from '@/app/(fi)/tietoa/mista-lieromaan-madot-tulevat/WormSource.module.css';
import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import { createLocalizedPageStructuredData } from '@/lib/structuredData/createLocalizedPageStructuredData.mjs';

const pageMetadata = {
  language: 'en',
  title: 'Where do Lieromaa’s compost worms come from?',
  description:
    'See how Lieromaa raises compost worms in a heated home garage in Järvenpää and collects each customer order from active worm bins.',
  canonicalUrl: '/en/about/where-our-worms-come-from',
  image: {
    url: '/images/content/lieromaan_matojen_hoitopiste.avif',
    width: 1200,
    height: 900,
    alt: 'Lieromaa worm-care and packing area in a heated home garage',
  },
};

const breadcrumbs = [
  { name: 'About', href: '/en/about' },
  { name: 'Where Lieromaa’s worms come from', href: pageMetadata.canonicalUrl },
];

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

export const dynamic = 'force-static';

export default function EnglishWormSourcePage() {
  const structuredData = createLocalizedPageStructuredData({
    ...pageMetadata,
    name: 'Where do Lieromaa’s compost worms come from?',
    image: pageMetadata.image.url,
    breadcrumbs,
    mainEntity: {
      '@type': 'Thing',
      name: 'How Lieromaa raises compost worms',
      description:
        'Lieromaa’s main flow-through worm bin, separate backup bins and order-collection routine in a heated home garage in Järvenpää.',
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <article className={classes.WormSourcePage}>
        <Breadcrumbs items={breadcrumbs} />

        <div className={classes.Content}>
          <section className={classes.Hero}>
            <div className={classes.HeroCopy}>
              <p className={classes.Eyebrow}>Lieromaa’s worms</p>
              <h1>Where do Lieromaa’s compost worms come from?</h1>
              <p className={classes.Lead}>
                Lieromaa’s compost worms are raised at my home in a heated garage. This
                page shows my worm bins and the area where I care for the worms and
                prepare customer orders.
              </p>
            </div>

            <figure className={classes.HeroImage}>
              <SafeImage
                src="/images/content/lieromaan_matojen_hoitopiste.avif"
                alt="Lieromaa worm-care area, packing table and worm bins in a heated home garage"
                width={1200}
                height={900}
                sizes="(max-width: 760px) 100vw, 42rem"
                priority
              />
              <figcaption className={classes.Caption}>
                I use the same table to inspect the bins, weigh customer orders and pack
                the worms for transport.
              </figcaption>
            </figure>
          </section>

          <section className={classes.FeatureSection}>
            <div className={classes.TextStack}>
              <h2>From a small beginning to my own system</h2>
              <p>
                I started in spring 2024 with about one thousand compost worms. The main
                system is now a stack of three boxes of approximately 50 litres each. The
                worms sold to customers are raised in this system and in smaller backup
                bins.
              </p>
              <p>
                Three smaller 14-litre boxes are separate backup and experimental worm
                bins. I use them to test worm-bedding materials and the effect of
                ventilation on moisture. Their most important purpose is resilience: if
                something unexpected happens, the worms are not all dependent on one
                system. I use the same easy-to-handle size for the{' '}
                <SafeLink href="/en/products/compost-worms#ready-to-use-worm-bin">
                  ready-to-use 14-litre worm bin
                </SafeLink>{' '}
                available with a worm order.
              </p>
            </div>

            <dl className={classes.FactList}>
              <div className={classes.Fact}>
                <dt>Started</dt>
                <dd>About 1,000 worms in spring 2024.</dd>
              </div>
              <div className={classes.Fact}>
                <dt>Main worm bin</dt>
                <dd>A flow-through system of three approximately 50-litre boxes.</dd>
              </div>
              <div className={classes.Fact}>
                <dt>Backup</dt>
                <dd>Three separate 14-litre experimental worm bins.</dd>
              </div>
            </dl>
          </section>

          <section className={classes.SplitSection}>
            <figure className={classes.ImageFrame}>
              <SafeImage
                src="/images/content/lieromaan_paakompostorin_aktiivinen_kerros.avif"
                alt="Active layer of Lieromaa’s main worm bin, showing worm bedding and a compost worm"
                width={1200}
                height={900}
                sizes="(max-width: 760px) 100vw, 32rem"
              />
              <figcaption className={classes.Caption}>
                The active layer of the main bin is not beautiful, and it does not need to
                be, as long as it works.
              </figcaption>
            </figure>

            <div className={classes.TextStack}>
              <h2>Monday is worm day</h2>
              <p>
                Monday is Lieromaa’s worm-care and dispatch day. I open the boxes, check
                what is happening and gently loosen the worm bedding so that it stays
                airy. If the material feels too wet, I add dry bedding.
              </p>
              <p>
                During the week, I collect my household’s food waste in the freezer for
                feeding. The worms usually receive about five litres of food waste per
                week, although I do not measure it precisely. If there is little household
                food waste, I can use a separate{' '}
                <SafeLink href="/en/products/compost-fibre-mix">
                  compost fibre mix
                </SafeLink>{' '}
                as supplementary feed.
              </p>
            </div>
          </section>

          <section className={classes.SplitSection}>
            <div className={classes.TextStack}>
              <h2>How are the worms for an order collected?</h2>
              <p>
                When I have customer orders, I put fresh, moist worm bedding into the
                transport container, place it on the scales and zero them. I then collect
                compost worms from a worm bin until the scales show the weight the
                customer ordered.
              </p>
              <p>
                Material from the active worm bin is included so that beneficial microbes
                are transferred to the customer’s new worm bin with the worms.
              </p>
            </div>

            <figure className={classes.ImageFrame}>
              <SafeImage
                src="/images/content/kompostimadot_petimateriaalissa_kadella.avif"
                alt="Compost worms in moist worm bedding on a gloved hand"
                width={1200}
                height={900}
                sizes="(max-width: 760px) 100vw, 32rem"
              />
              <figcaption className={classes.Caption}>
                Worms for customer orders are collected directly from an active worm bin.
              </figcaption>
            </figure>
          </section>

          <section className={classes.FeatureSection}>
            <div className={classes.TextStack}>
              <h2>Why do I keep separate experimental boxes?</h2>
              <p>
                In the small 14-litre bins, the worms process material more slowly than in
                the main stack. When a box is ready, I harvest the worm castings using
                light separation and start the box again.
              </p>
            </div>

            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>Worm-bedding experiments</h3>
                <p>
                  I have tested materials including coconut coir and shredded cardboard.
                  The experiments show how different materials behave in a real worm bin.
                </p>
              </div>
              <div className={classes.InfoCard}>
                <h3>Ventilation and moisture</h3>
                <p>
                  I have drilled ventilation holes in different patterns to see how
                  airflow affects moisture and the texture of the processed material.
                </p>
              </div>
              <div className={classes.InfoCard}>
                <h3>Protection against unexpected problems</h3>
                <p>
                  The small bins are a backup system. If something unexpected happened to
                  the main stack, all the worms would not be in the same bin.
                </p>
              </div>
            </div>
          </section>

          <section className={classes.SplitSection}>
            <figure className={classes.ImageFrame}>
              <SafeImage
                src="/images/content/pahvi_ja_kookoskuitu_petimateriaalina.avif"
                alt="Two small worm bins comparing shredded cardboard and coconut coir as worm bedding"
                width={1200}
                height={900}
                sizes="(max-width: 760px) 100vw, 32rem"
              />
              <figcaption className={classes.Caption}>
                Coconut coir and shredded cardboard behave differently, so I compare them
                in practice.
              </figcaption>
            </figure>

            <figure className={classes.ImageFrame}>
              <SafeImage
                src="/images/content/kompostimadot_pahvipetimateriaalissa.avif"
                alt="Compost worms on shredded-cardboard bedding in a small experimental worm bin"
                width={1200}
                height={900}
                sizes="(max-width: 760px) 100vw, 32rem"
              />
              <figcaption className={classes.Caption}>
                The worms’ wellbeing comes first in the small experimental boxes too.
              </figcaption>
            </figure>
          </section>
        </div>
      </article>
    </>
  );
}
