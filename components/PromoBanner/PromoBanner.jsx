import PromoBox from '../PromoBox/Promobox';
import SafeLink from '../SafeLink/SafeLink';

export default function PromoBanner({
  badge,
  children,
  href,
  linkLabel,
  prefetch = false,
}) {
  if (!badge && !children && !(href && linkLabel)) {
    return null;
  }

  return (
    <PromoBox>
      {badge ? <strong>{badge}</strong> : null}
      {badge && children ? ' ' : null}
      {children}
      {href && linkLabel ? (
        <>
          {' '}
          <SafeLink
            href={href}
            style={{ color: 'var(--text-color)', fontWeight: 700 }}
            prefetch={prefetch}
          >
            {linkLabel}
          </SafeLink>
        </>
      ) : null}
    </PromoBox>
  );
}
