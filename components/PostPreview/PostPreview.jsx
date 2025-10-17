import Link from 'next/link';

import classes from './PostPreview.module.css';

const PostPreview = ({ post, compact = false, overrideHref = false }) => {
  return (
    <div className={classes.PostPreview}>
      <h2 className={classes.Title}>
        <Link
          href={
            overrideHref
              ? overrideHref
              : `/${post.altPath || `blogi/julkaisu`}/${post.slug}`
          }
        >
          {post.title}
        </Link>
      </h2>
      <p className={classes.Excerpt}>{post.excerpt}</p>
      <p className={classes.Tags}>
        {post.tags &&
          post.tags.map((tag) => (
            <Link
              href={`/blogi/${tag.toLowerCase().replaceAll(' ', '-')}/sivu/1`}
              key={tag}
              className={classes.Tag}
            >
              {tag}
            </Link>
          ))}
      </p>
      {!compact && (
        <Link
          aria-label={`Avaa julkaisu ${post.title}`}
          href={
            overrideHref
              ? overrideHref
              : `/${post.altPath || `blogi/julkaisu`}/${post.slug}`
          }
        >
          <span>
            Lue lisää{' '}
            <span className={classes.Arrow}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </span>
        </Link>
      )}
    </div>
  );
};

export default PostPreview;
