import classes from '@/components/NotFoundClient/NotFoundClient.module.css';
import SafeLink from '@/components/SafeLink/SafeLink';
import { getCommonMessages } from '@/lib/i18n/messages.mjs';

const copy = getCommonMessages('en').notFound;

export const metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  robots: { index: false, follow: false },
};

export default function EnglishNotFound() {
  return (
    <>
      <div className={classes.Oops}>{copy.eyebrow}</div>
      <h1 className={classes.NotFoundPage}>{copy.title}</h1>
      <div className={classes.LinkWrapper}>
        <SafeLink href="/en">{copy.search}</SafeLink>
        <SafeLink href="/en/products/compost-worms">{copy.guides}</SafeLink>
      </div>
    </>
  );
}
