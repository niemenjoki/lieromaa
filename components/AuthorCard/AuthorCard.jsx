import { SITE_AUTHOR } from '@/data/site/author';

import SafeImage from '../SafeImage/SafeImage';
import SafeLink from '../SafeLink/SafeLink';
import classes from './AuthorCard.module.css';

export default function AuthorCard() {
  return (
    <div className={classes.AuthorBox}>
      <SafeImage
        src={SITE_AUTHOR.portrait}
        alt={SITE_AUTHOR.portraitAlt}
        width={90}
        height={90}
        placeholder="blur"
      />
      <div className={classes.AuthorInfo}>
        <p className={classes.AuthorHeading}>
          <strong>Kirjoittaja:</strong> {SITE_AUTHOR.name}
        </p>
        {SITE_AUTHOR.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p>
          <a href={SITE_AUTHOR.linkedInUrl} target="_blank" rel="noopener noreferrer">
            LinkedIn-profiili
          </a>{' '}
          • <SafeLink href={SITE_AUTHOR.profilePath}>Lue lisää minusta</SafeLink>
        </p>
      </div>
    </div>
  );
}
