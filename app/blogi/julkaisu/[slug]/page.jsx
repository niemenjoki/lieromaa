import Image from 'next/image';
import Link from 'next/link';

import fs from 'fs';
import { marked } from 'marked';
import path from 'path';

import Advert from '@/components/Advert/Advert';
import PostRecommendation from '@/components/PostRecommendation/PostRecommendation';
import SocialShareButtons from '@/components/SocialShareButtons/SocialShareButtons';
import { SITE_URL } from '@/data/vars';
import portrait from '@/public/images/portrait2024.png';
import extractFrontMatter from '@/utils/extractFrontMatter';
import getPostRecommendations from '@/utils/getPostRecommendations';

import classes from './PostPage.module.css';

export async function generateStaticParams() {
  const files = fs.readdirSync('posts');
  return files.map((filename) => ({
    slug: filename.replace('.md', ''),
  }));
}

export async function generateMetadata({ params }) {
  const filePath = path.join('posts', params.slug + '.md');
  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { data } = extractFrontMatter(markdownWithMeta);

  const title = data.title || 'Luomuliero';
  const description = data.excerpt || '';
  const url = `${SITE_URL}/blogi/julkaisu/${params.slug}`;
  const image = data.image || `${SITE_URL}/icons/apple-touch-icon.png`;

  return {
    title: `${title} | Luomuliero`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function PostPage({ params }) {
  const filePath = path.join('posts', params.slug + '.md');
  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = extractFrontMatter(markdownWithMeta);

  const htmlContent = marked(content);
  const recommendedPosts = await getPostRecommendations({
    self: params.slug,
    keywords: data.keywords + ',' + data.tags,
  });

  const structuredData = data.structuredData || [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: data.title,
      description: data.excerpt,
      datePublished: data.date,
      author: { '@type': 'Person', name: 'Joonas Niemenjoki' },
      publisher: {
        '@type': 'Organization',
        name: 'Luomuliero',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.luomuliero.fi/icons/apple-touch-icon.png',
        },
      },
      mainEntityOfPage: `${SITE_URL}/blogi/julkaisu/${params.slug}`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <article className={classes.PostPage}>
        <h1>{data.title}</h1>
        <div className={classes.Date}>
          Julkaistu: {new Date(data.date).toLocaleDateString('fi-FI')}
        </div>

        <div
          className={classes.Content}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className={classes.AuthorBox}>
          <Image
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
              Olen Järvenpäässä asuva matokompostoinnin harrastaja ja
              Luomuliero.fi-sivuston perustaja. Päivisin työskentelen rakennusautomaation
              ohjelmoijana ja keskityn energiatehokkuuteen.
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
              • <Link href="/tietoa">Lue lisää minusta</Link>
            </p>
          </div>
        </div>
      </article>

      <SocialShareButtons title={data.title} text={data.excerpt} tags={data.tags} />
      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
      <PostRecommendation posts={recommendedPosts} />
    </>
  );
}
