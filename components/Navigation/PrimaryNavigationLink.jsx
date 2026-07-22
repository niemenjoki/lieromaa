'use client';

import SafeLink from '@/components/SafeLink/SafeLink';

import NavigationIcon from './NavigationIcon';
import WormMarker from './WormMarker';
import { useWormNavigation } from './WormNavigationProvider';

function isUnmodifiedPrimaryClick(event) {
  const target = event.currentTarget.getAttribute('target');

  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    !event.currentTarget.hasAttribute('download') &&
    (!target || target === '_self')
  );
}

export default function PrimaryNavigationLink({
  children,
  item,
  className,
  iconClassName,
  labelClassName,
  onClick,
}) {
  const { beginTransition, routeActiveId } = useWormNavigation();
  const isActive = routeActiveId === item.id;

  const handleClick = (event) => {
    onClick?.(event);

    if (isUnmodifiedPrimaryClick(event)) {
      beginTransition(item.id);
    }
  };

  return (
    <SafeLink
      href={item.href}
      className={className}
      aria-current={isActive ? 'page' : undefined}
      data-primary-navigation-id={item.id}
      data-navigation-active={isActive ? 'true' : 'false'}
      onClick={handleClick}
    >
      {children ?? (
        <>
          <NavigationIcon name={item.icon} className={iconClassName} />
          <span className={labelClassName}>{item.label}</span>
        </>
      )}
      <WormMarker itemId={item.id} />
    </SafeLink>
  );
}
