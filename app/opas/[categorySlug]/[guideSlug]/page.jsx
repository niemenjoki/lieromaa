import { MDXRemote } from 'next-mdx-remote/rsc';

import classes from 'app/blogi/julkaisu/[slug]/PostPage.module.css';
import fs from 'fs';
import path from 'path';

import Advert from '@/components/Advert/Advert';
import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';
import SocialShareButtons from '@/components/SocialShareButtons/SocialShareButtons';
import { CONTENT_TYPES } from '@/data/vars.mjs';
import { getAllContent, getContentMetadata } from '@/lib/content/index.mjs';
import portrait from '@/public/images/portrait2024.avif';

export const mdxComponents = {
  SafeLink,
  SafeImage,
};

export function generateStaticParams() {
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE });

  return guides.map((guide) => ({
    categorySlug: guide.category.name.replaceAll(' ', '-'),
    guideSlug: guide.slug,
  }));
}

export { default as generateMetadata } from './generateMetadata';

export default async function GuidePage({ params }) {
  const { guideSlug, categorySlug } = await params;
  const data = getContentMetadata({ type: CONTENT_TYPES.GUIDE, slug: guideSlug });

  const mdxPath = path.join(process.cwd(), 'content', 'guides', guideSlug, 'content.mdx');
  const mdxContent = fs.readFileSync(mdxPath, 'utf-8');

  const { structuredData } = data;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <article className={classes.PostPage}>
        <Breadcrumbs
          items={[
            { name: 'Etusivu', href: '/' },
            { name: 'Opas' },
            { name: categorySlug.replaceAll('-', ' '), href: `/opas/${categorySlug}` },
            { name: data.title },
          ]}
        />

        <h1>{data.title}</h1>
        <div className={classes.Date}>
          Päivitetty: {new Date(data.updated).toLocaleDateString('fi-FI')}
        </div>

        <div className={classes.Content + ' .md'}>
          <MDXRemote source={mdxContent} components={mdxComponents} />
        </div>

        <div className={classes.AuthorBox}>
          <SafeImage
            src={portrait}
            alt="Valokuva Joonas Niemenjoesta"
            width={90}
            height={90}
            placeholder="blur"
          />
          <div className={classes.AuthorInfo}>
            <p className={classes.AuthorHeading}>
              <strong>Kirjoittaja:</strong> Joonas Niemenjoki
            </p>
            <p>
              Olen Järvenpäässä asuva matokompostoinnin harrastaja ja Lieromaa.fi-sivuston
              perustaja. Päivisin työskentelen rakennusautomaation ohjelmoijana ja
              keskityn energiatehokkuuteen.
            </p>
            <p>
              Kirjoitan asioista, joita olen itse kokeillut ja joista on kertynyt
              käytännön kokemusta. Tavoitteena on tehdä kompostoinnista helpommin
              ymmärrettävää ja käytännöllistä arjessa.
            </p>
            <p>
              <a
                href="https://www.linkedin.com/in/joonasniemenjoki/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn-profiili
              </a>{' '}
              • <SafeLink href="/tietoa">Lue lisää minusta</SafeLink>
            </p>
          </div>
        </div>
      </article>

      <SocialShareButtons title={data.title} text={data.excerpt} tags={data.tags} />
      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
    </>
  );
}
