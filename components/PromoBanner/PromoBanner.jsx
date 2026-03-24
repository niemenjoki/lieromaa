import PromoBox from '../PromoBox/Promobox';
import SafeLink from '../SafeLink/SafeLink';

const contentRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.9rem',
};

const copyStyle = {
  flex: '1 1 18rem',
  lineHeight: 1.5,
};

const buttonStyle = {
  display: 'inline-block',
  flexShrink: 0,
  padding: '0.75rem 1.1rem',
  borderRadius: '6px',
  backgroundColor: 'var(--highlight)',
  color: 'var(--text-on-accent)',
  fontWeight: 700,
  textDecoration: 'none',
};

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
      <div style={contentRowStyle}>
        <div style={copyStyle}>
          {badge ? <strong>{badge}</strong> : null}
          {badge && children ? ' ' : null}
          {children}
        </div>

        {href && linkLabel ? (
          <SafeLink href={href} style={buttonStyle} prefetch={prefetch}>
            {linkLabel}
          </SafeLink>
        ) : null}
      </div>
    </PromoBox>
  );
}
