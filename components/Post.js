import Link from 'next/link';

import classes from '@/styles/Post.module.css';

const Post = ({ post, compact = false }) => {
  if (typeof post.tags === 'string') {
    post.tags = post.tags.split(',').map((tag) => tag.trim());
  }

  return (
    <div className={classes.Post}>
      <h2 className={classes.Title}>
        <Link href={`/${post.altPath || `blogi/julkaisu`}/${post.slug}`}>
          {post.title}
        </Link>
      </h2>
      <p className={classes.Excerpt}>{post.excerpt}</p>
      <p className={classes.Tags}>
        {post.tags &&
          post.tags.map((tag) => (
            <Link
              href={`/blogi/${tag.toLowerCase()}/sivu/1`}
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
          href={`/${post.altPath || `blogi/julkaisu`}/${post.slug}`}
        >
          <h3>
            Lue lisää{' '}
            <span className={classes.Arrow}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </h3>
        </Link>
      )}
    </div>
  );
};

export default Post;
