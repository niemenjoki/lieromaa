import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';

import fs from 'fs';
import path from 'path';

import Advert from '@/components/Advert/Advert';
import PostRecommendation from '@/components/PostRecommendation/PostRecommendation';
import SocialShareButtons from '@/components/SocialShareButtons/SocialShareButtons';
import { SITE_URL } from '@/data/vars';
import { getAllPostSlugs, getPostMetadata, getPostRecommendations } from '@/lib/posts';
import portrait from '@/public/images/portrait2024.png';

import classes from './PostPage.module.css';

export const mdxComponents = {
  Image,
};

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = getPostMetadata(slug);

  const title = data.title || '';
  const description = data.excerpt || '';
  const url = `${SITE_URL}/blogi/julkaisu/${slug}`;
  const image = data.image || {
    url: 'https://www.lieromaa.fi/images/luomuliero_logo_1024.png',
    width: 1024,
    height: 1024,
    alt: 'Lieromaa logo',
  };

  return {
    title: `${title}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      siteName: 'Lieromaa',
      title,
      description,
      type: 'article',
      url,
      images: [image],
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
  const { slug } = await params;
  const data = getPostMetadata(slug);

  const mdxPath = path.join(process.cwd(), 'posts', slug, 'post.mdx');
  const mdxContent = fs.readFileSync(mdxPath, 'utf-8');

  const recommendedPosts = await getPostRecommendations({
    self: slug,
    keywords: [...data.tags, ...data.keywords],
  });

  const structuredData = data.structuredData || [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: data.title,
      description: data.excerpt,
      datePublished: data.date,
      dateModified: data.updated || data.date,
      articleSection: data.category || 'Blogi',
      keywords: data.tags?.join(', '),
      image: [data.image || `${SITE_URL}/images/luomuliero_logo_1024.png`],
      author: { '@type': 'Person', name: 'Joonas Niemenjoki' },
      publisher: {
        '@type': 'Organization',
        name: 'Lieromaa',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.lieromaa.fi/images/luomuliero_logo_1024.png',
        },
      },
      mainEntityOfPage: `${SITE_URL}/blogi/julkaisu/${slug}`,
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
          {data.updated
            ? ` (Päivitetty: ${new Date(data.updated).toLocaleDateString('fi-FI')})`
            : undefined}
        </div>

        <div className={classes.Content + ' .md'}>
          <MDXRemote source={mdxContent} components={mdxComponents} />
        </div>

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
