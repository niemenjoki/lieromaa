import classes from '@/app/(fi)/tietoa/Tietoa.module.css';
import FinnishContentLinks from '@/components/FinnishContentLinks/FinnishContentLinks';
import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import { SITE_AUTHOR } from '@/lib/site/author';
import {
  AUTHOR_ID,
  AUTHOR_IMAGE_PATH,
  AUTHOR_LINKEDIN_URL,
  ORGANIZATION_ID,
} from '@/lib/site/schema.mjs';
import { createLocalizedPageStructuredData } from '@/lib/structuredData/createLocalizedPageStructuredData.mjs';

const pageMetadata = {
  language: 'en',
  title: 'About Lieromaa and its founder | Lieromaa',
  description:
    'Meet Lieromaa founder Joonas Niemenjoki and learn how practical experience with home worm composting grew into a small Finnish business.',
  canonicalUrl: '/en/about',
};

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

export default function EnglishAboutPage() {
  const structuredData = createLocalizedPageStructuredData({
    ...pageMetadata,
    name: 'About Lieromaa',
    type: 'AboutPage',
    mainEntity: {
      '@type': 'Person',
      '@id': AUTHOR_ID,
      name: SITE_AUTHOR.name,
      description:
        'Founder of Lieromaa, automation programmer and worm-composting enthusiast based in Järvenpää, Finland.',
      image: `https://www.lieromaa.fi${AUTHOR_IMAGE_PATH}`,
      jobTitle: 'Founder',
      worksFor: { '@id': ORGANIZATION_ID },
      sameAs: [AUTHOR_LINKEDIN_URL, 'https://www.instagram.com/lieromaa'],
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

      <div className={classes.AboutPage}>
        <div className={classes.Info}>
          <SafeImage
            src={SITE_AUTHOR.portrait}
            alt="Portrait of Joonas Niemenjoki"
            placeholder="blur"
            width={200}
            height={200}
            priority
          />
          <h1>Joonas Niemenjoki</h1>
        </div>

        <div className={classes.Bio}>
          <h2>About me</h2>
          <p>
            Hello, I’m <strong>Joonas Niemenjoki</strong>, the founder of Lieromaa.fi. I
            live in Järvenpää, I’m a father to a young child and a keen worm composter. In
            my day job, I program heat-pump systems and optimise them to operate as
            energy-efficiently as possible. Sustainable living and natural cycles matter
            to me, and the whole idea of Lieromaa grew from those interests.
          </p>

          <h2>How it all began</h2>
          <p>
            In spring 2024, I moved from a block of flats to a terraced house and bought a
            traditional hot composter for my household’s food waste. Things did not get
            off to a smooth start: the composter did not work as expected, and I had to
            learn everything myself. When I found videos about <em>worm composting</em> on
            YouTube, I wanted to try it. I began with a small amount of compost worms, and
            now much of my household’s food waste passes through their bin and returns to
            the soil.
          </p>
          <p>
            If you would like to see where the worms sold by Lieromaa are raised, visit{' '}
            <SafeLink
              href="/en/about/where-our-worms-come-from"
              className={classes.InlineLink}
            >
              Where do Lieromaa’s compost worms come from?
            </SafeLink>
          </p>

          <h2>Why I founded Lieromaa</h2>
          <p>
            I wanted to share practical experience that is often missing from official
            instructions. Many composting sites provide broad information; I write about
            what <strong>I have tried myself and found to work</strong>. My aim is to make
            Lieromaa the best place in Finland to learn about worm composting and to
            encourage more people to recycle food waste in an easy, environmentally
            friendly way.
          </p>

          <h2>My vision</h2>
          <p>
            I hope worm composting will one day be as commonplace in Finland as sorting
            household waste. I can also see it becoming part of teaching in schools and
            nurseries: a concrete way to show how natural cycles work.
          </p>
          <p>
            The detailed guide library and blog are currently written in Finnish. The
            English section focuses on the product information and practical support
            needed to order and start successfully.
          </p>

          <hr />

          <p>
            <small>
              Lieromaa.fi is an independent site built around a personal hobby and small
              business. I do not represent a public authority; I share information and
              practical advice based on my own experience.
            </small>
          </p>
        </div>

        <FinnishContentLinks compact />
      </div>
    </>
  );
}
