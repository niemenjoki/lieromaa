import { MDXRemote } from 'next-mdx-remote/rsc';

import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';
import SocialShareButtons from '@/components/SocialShareButtons/SocialShareButtons';

import AuthorCard from '../AuthorCard/AuthorCard';
import classes from './MdxArticlePage.module.css';

function ArticleLink({ href, children, ...props }) {
  if (typeof href === 'string' && href.startsWith('/')) {
    return (
      <SafeLink href={href} {...props}>
        {children}
      </SafeLink>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

const mdxComponents = {
  a: ArticleLink,
  SafeLink,
  SafeImage,
};

export default function MdxArticlePage({
  structuredData,
  title,
  dateContent,
  source,
  preTitle = null,
  share = null,
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <article className={classes.Article}>
        {preTitle}
        <h1>{title}</h1>
        <div className={classes.Date}>{dateContent}</div>

        <div className={classes.Content}>
          <MDXRemote
            source={source}
            components={mdxComponents}
            options={{
              blockJS: false,
              blockDangerousJS: true,
            }}
          />
        </div>

        {share ? (
          <SocialShareButtons title={share.title} tags={share.tags ?? []} />
        ) : null}
        <AuthorCard />
      </article>
    </>
  );
}
