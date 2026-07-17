import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import FinnishContentLinks from '@/components/FinnishContentLinks/FinnishContentLinks';
import SafeLink from '@/components/SafeLink/SafeLink';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import { CONTACT_EMAIL } from '@/lib/site/contact';
import { createLocalizedPageStructuredData } from '@/lib/structuredData/createLocalizedPageStructuredData.mjs';

import classes from '../EnglishContent.module.css';

const pageMetadata = {
  language: 'en',
  title: 'Getting started with compost worms | Lieromaa',
  description:
    'Settle compost worms into their worm bin, feed them cautiously and recognise moisture, smell, temperature and escape problems during the first month.',
  canonicalUrl: '/en/getting-started-with-compost-worms',
};

const breadcrumbs = [
  { name: 'English home', href: '/en' },
  { name: 'Getting started with compost worms', href: pageMetadata.canonicalUrl },
];

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

export default function GettingStartedPage() {
  const structuredData = createLocalizedPageStructuredData({
    ...pageMetadata,
    name: 'Getting started with compost worms',
    type: 'Article',
    breadcrumbs,
    mainEntity: {
      '@type': 'Thing',
      name: 'Starting a worm bin with compost worms',
      description:
        'Practical first-month instructions for settling, feeding and monitoring compost worms in a home worm bin.',
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

      <article className={classes.Article}>
        <Breadcrumbs items={breadcrumbs} />
        <header className={classes.Hero}>
          <p className={classes.Eyebrow}>First month</p>
          <h1>Getting started with compost worms</h1>
          <p className={classes.Lead}>
            A new worm bin is a small living ecosystem. It needs time for the worms to
            settle and for microbes to soften the food. During the first month, feeding
            less than you think you need is usually the safest approach.
          </p>
        </header>

        <section className={classes.Section}>
          <h2>Which instructions apply to your order?</h2>
          <div className={classes.Grid}>
            <div className={classes.Card}>
              <h3>Worms-only orders</h3>
              <p>
                Prepare moist, airy worm bedding before the worms arrive. Move all the
                worms and all their transport bedding into the prepared bedding. The
                transport material carries beneficial microbes and should not be
                discarded.
              </p>
            </div>
            <div className={classes.Card}>
              <h3>Ready-to-use 14-litre worm-bin orders</h3>
              <p>
                The bedding, worms and first feeding have already been prepared. Place the
                bin in suitable conditions after delivery and begin feeding it gradually
                only after checking how the first food is breaking down.
              </p>
            </div>
          </div>
        </section>

        <section className={classes.Section}>
          <h2>The first 48 hours</h2>
          <p>
            Let the worms settle. For a worms-only setup, place the worms and transport
            bedding on top of the prepared worm bedding, close the lid and allow them to
            burrow down themselves. Do not stir them in, spread them around or add food to
            attract them.
          </p>
          <p>
            Individual worms may explore the surface or sides after transport. That is
            usually normal at first. Avoid repeated handling and do not add extra food
            during these first two days. Compost worms can live on suitable bedding for
            weeks, while excess fresh food can quickly make a new bin too wet or smelly.
          </p>
        </section>

        <section className={classes.Section}>
          <h2>First feeding and the first four weeks</h2>
          <ol>
            <li>
              <strong>Week 1:</strong> after the settling period, offer a very small test
              portion, such as a tablespoon of overripe banana, soft cucumber or another
              soft plant-based scrap. Bury it lightly under the bedding.
            </li>
            <li>
              <strong>Week 2:</strong> check the previous portion before adding anything.
              Feed again only when it has mostly disappeared or become dark, crumbly
              material. If it is still clearly present, wait several more days.
            </li>
            <li>
              <strong>Week 3:</strong> increase portions only a little if the earlier food
              is being processed. A tablespoon can become two tablespoons; do not jump
              straight to all of the household’s food waste.
            </li>
            <li>
              <strong>Week 4:</strong> keep the same check-before-feeding rhythm. Dark,
              crumbly worm castings may begin to appear, but the bin’s full processing
              capacity will continue to develop over time.
            </li>
          </ol>
          <p>
            As a rough operating estimate, the worms can process about their own weight in
            suitable food waste per week. Their number can approximately double in three
            months when conditions and feeding remain suitable.
          </p>
        </section>

        <section className={classes.Section}>
          <h2>Food essentials</h2>
          <div className={classes.Grid}>
            <div className={classes.Card}>
              <h3>Suitable in small portions</h3>
              <ul>
                <li>Soft fruit and vegetable scraps and peelings</li>
                <li>Coffee grounds and paper filters</li>
                <li>Tea and plastic-free, staple-free tea bags</li>
                <li>Small amounts of cooked plain rice, pasta or porridge</li>
                <li>Finely crushed eggshell for occasional mineral balance</li>
              </ul>
            </div>
            <div className={classes.Card}>
              <h3>Avoid or strictly limit</h3>
              <ul>
                <li>Meat, fish and dairy products</li>
                <li>Large amounts of oil, fat, salty or heavily processed food</li>
                <li>Large amounts of citrus fruit or other very acidic food</li>
                <li>Onion, garlic and spicy food except in very small amounts</li>
              </ul>
            </div>
          </div>
          <p>
            Chop or soften food where practical, keep portions small and cover them with
            bedding. Freezing surplus scraps for later is better than overfeeding the bin.
          </p>
        </section>

        <section className={classes.Section}>
          <h2>Moisture, smell, temperature and worms trying to escape</h2>
          <div className={classes.FactGrid}>
            <dl className={classes.Fact}>
              <dt>Moisture</dt>
              <dd>
                Bedding should feel moist and airy. When squeezed firmly, it should
                release only a couple of drops. If water runs out or collects at the
                bottom, the bin is too wet; crumbly, dry bedding needs a light mist or a
                very small amount of moist food.
              </dd>
            </dl>
            <dl className={classes.Fact}>
              <dt>Smell</dt>
              <dd>
                A healthy bin smells mild and earthy. A sharp vinegar, drain or rotting
                food smell is a clear sign of too much food, too much moisture or poor
                airflow.
              </dd>
            </dl>
            <dl className={classes.Fact}>
              <dt>Temperature</dt>
              <dd>
                The worms can survive roughly 0–35 °C, but about 15–25 °C is preferable.
                Keep the bin away from direct sunlight, cold floors and places that are
                too hot or cold.
              </dd>
            </dl>
            <dl className={classes.Fact}>
              <dt>Escape behaviour</dt>
              <dd>
                A few worms on the sides during the first days can be normal. If many
                worms are still trying to leave after the first weeks, check moisture,
                temperature, smell and uneaten food immediately.
              </dd>
            </dl>
          </div>
        </section>

        <section className={classes.Section}>
          <h2>Basic corrective actions</h2>
          <p>
            Intervene if the bin smells bad, water collects at the bottom, food rots for
            weeks or many worms continue trying to escape.
          </p>
          <ol>
            <li>Stop feeding for at least a week.</li>
            <li>Remove clearly spoiled clumps of food.</li>
            <li>Add dry worm bedding and mix it gently into the wettest areas.</li>
            <li>Check both temperature and moisture.</li>
            <li>Restart with a smaller portion only after conditions have improved.</li>
          </ol>
        </section>

        <section className={classes.Section}>
          <h2>Contact and next actions</h2>
          <p className={classes.ContactLine}>
            If you are unsure about the condition of worms supplied by Lieromaa, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Include a clear
            description and, where useful, photographs of the bedding and bin.
          </p>
          <p>
            The English{' '}
            <SafeLink href="/en/products/compost-worms">
              compost-worm product page
            </SafeLink>{' '}
            contains the product quantities, availability and ordering details. You can
            also{' '}
            <SafeLink href="/en/worm-calculator">estimate a starting amount</SafeLink>{' '}
            before ordering.
          </p>
        </section>

        <FinnishContentLinks />
      </article>
    </>
  );
}
