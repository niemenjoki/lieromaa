import { MDXRemote } from 'next-mdx-remote/rsc';

import ArticleContents from '@/components/ArticleContents/ArticleContents';
import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';
import SocialShareButtons from '@/components/SocialShareButtons/SocialShareButtons';
import { extractArticleHeadings } from '@/lib/content/articleHeadings.mjs';

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

function createMdxComponents(headings) {
  let headingIndex = 0;

  function renderHeading(Tag, children, props) {
    const heading = headings[headingIndex];
    headingIndex += 1;

    return (
      <Tag {...props} id={heading?.id}>
        {children}
      </Tag>
    );
  }

  function HeadingTwo({ children, ...props }) {
    return renderHeading('h2', children, props);
  }

  function HeadingThree({ children, ...props }) {
    return renderHeading('h3', children, props);
  }

  return {
    a: MarkdownLink,
    h2: HeadingTwo,
    h3: HeadingThree,
    SafeImage,
  };
}

export default function MdxArticlePage({
  structuredData,
  title,
  dateContent,
  source,
  preTitle = null,
  share = null,
}) {
  const headings = extractArticleHeadings(source);
  const hasContents = headings.length >= 3;
  const mdxComponents = createMdxComponents(headings);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <article className={classes.Article}>
        <header className={classes.Header}>
          {preTitle}
          <h1>{title}</h1>
          <div className={classes.Date}>{dateContent}</div>
        </header>

        <div
          className={`${classes.ArticleGrid} ${!hasContents ? classes.ArticleGridWithoutContents : ''}`}
        >
          <ArticleContents headings={headings} />
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
        </div>

        <footer className={classes.ArticleFooter}>
          {share ? (
            <SocialShareButtons title={share.title} tags={share.tags ?? []} />
          ) : null}
          <AuthorCard />
        </footer>
      </article>
    </>
  );
}
