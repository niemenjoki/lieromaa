import { MDXRemote } from 'next-mdx-remote/rsc';

import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';
import SocialShareButtons from '@/components/SocialShareButtons/SocialShareButtons';

import AuthorCard from '../AuthorCard/AuthorCard';
import classes from './MdxArticlePage.module.css';

function isInternalMarkdownHref(href) {
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//');
}

function MarkdownLink({ href, children, ...props }) {
  if (isInternalMarkdownHref(href)) {
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
  a: MarkdownLink,
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
