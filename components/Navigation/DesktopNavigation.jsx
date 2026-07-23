'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { usePathname } from 'next/navigation';

import CartButton from '@/components/Cart/CartButton';
import SafeImage from '@/components/SafeImage/SafeImage';
import SiteSearch from '@/components/SiteSearch/SiteSearch';
import ThemeToggler from '@/components/ThemeToggler/ThemeToggler';
import { normalizeNavigationPath } from '@/lib/navigation/activeRoute.mjs';

import classes from './DesktopNavigation.module.css';
import DesktopNavigationTray from './DesktopNavigationTray';
import NavigationAuxiliaryLink from './NavigationAuxiliaryLink';
import PrimaryNavigationLink from './PrimaryNavigationLink';
import WormBurrowTrail from './WormBurrowTrail';

export default function DesktopNavigation({
  copy,
  desktopPrimaryItems = [],
  guideCategories = [],
  labels,
  language,
  primaryItems = [],
  productItems = [],
  searchItems,
  secondarySections = [],
  settingsSection,
}) {
  const pathname = usePathname();
  const commandBarRef = useRef(null);
  const guideTriggerRef = useRef(null);
  const productTriggerRef = useRef(null);
  const secondaryTriggerRef = useRef(null);
  const [openTray, setOpenTray] = useState(null);
  const idPrefix = useId().replaceAll(':', '');
  const guideTrayId = `${idPrefix}-guide-tray`;
  const productTrayId = `${idPrefix}-product-tray`;
  const secondaryTrayId = `${idPrefix}-secondary-tray`;
  const homeItem =
    primaryItems.find((item) => item.id === 'home') ?? primaryItems[0] ?? null;
  const guidePrimaryId =
    primaryItems.find((item) => /guide|opas/.test(item.id))?.id ?? null;
  const productPrimaryId = primaryItems.find((item) => item.id === 'shop')?.id ?? null;

  const closeTray = useCallback(
    (restoreFocus = false) => {
      const trayToClose = openTray;
      setOpenTray(null);

      if (restoreFocus) {
        globalThis.requestAnimationFrame?.(() => {
          if (trayToClose === 'guides') {
            guideTriggerRef.current?.querySelector('a')?.focus();
          } else if (trayToClose === 'products') {
            productTriggerRef.current?.querySelector('a')?.focus();
          } else if (trayToClose === 'secondary') {
            secondaryTriggerRef.current?.focus();
          }
        });
      }
    },
    [openTray]
  );

  useEffect(() => {
    setOpenTray(null);
  }, [pathname]);

  useEffect(() => {
    if (!openTray) {
      return undefined;
    }

    const isInsideActiveDisclosure = (target) => {
      const trayId =
        openTray === 'guides'
          ? guideTrayId
          : openTray === 'products'
            ? productTrayId
            : secondaryTrayId;
      const tray = document.getElementById(trayId);
      const trigger =
        openTray === 'guides'
          ? guideTriggerRef.current
          : openTray === 'products'
            ? productTriggerRef.current
            : secondaryTriggerRef.current;

      return tray?.contains(target) || trigger?.contains(target);
    };
    const handlePointerDown = (event) => {
      if (!isInsideActiveDisclosure(event.target)) {
        closeTray(false);
      }
    };
    const handleFocusIn = (event) => {
      if (!isInsideActiveDisclosure(event.target)) {
        closeTray(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeTray(true);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeTray, guideTrayId, openTray, productTrayId, secondaryTrayId]);

  useEffect(() => {
    if (openTray !== 'secondary') {
      return undefined;
    }

    const frameId = globalThis.requestAnimationFrame?.(() => {
      document
        .getElementById(secondaryTrayId)
        ?.querySelector('a, input, button')
        ?.focus();
    });

    return () => globalThis.cancelAnimationFrame?.(frameId);
  }, [openTray, secondaryTrayId]);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia?.('(max-width: 960px)');
    const closeAtMobileWidth = () => {
      if (mediaQuery?.matches) {
        setOpenTray(null);
      }
    };

    closeAtMobileWidth();
    mediaQuery?.addEventListener?.('change', closeAtMobileWidth);
    return () => mediaQuery?.removeEventListener?.('change', closeAtMobileWidth);
  }, []);

  const toggleTray = (trayName) => {
    setOpenTray((current) => (current === trayName ? null : trayName));
  };

  const normalizedPathname = normalizeNavigationPath(pathname);
  const showGuideContext =
    guidePrimaryId != null &&
    (normalizedPathname === '/opas' || normalizedPathname.startsWith('/opas/'));

  return (
    <header
      className={classes.DesktopRoot}
      data-navigation-surface="desktop"
      data-open-navigation-tray={openTray ?? 'none'}
      onMouseLeave={() => {
        if (openTray === 'guides' || openTray === 'products') {
          closeTray(false);
        }
      }}
    >
      <div className={classes.CommandBand}>
        <div ref={commandBarRef} className={classes.CommandBar}>
          {homeItem ? (
            <PrimaryNavigationLink item={homeItem} className={classes.BrandLink}>
              <SafeImage
                src="/images/lieromaa_logo.svg"
                alt={copy.navbar.logoAlt}
                width={42}
                height={42}
                className={classes.Logo}
                priority
                unoptimized
              />
              <span className={classes.BrandText}>Lieromaa</span>
            </PrimaryNavigationLink>
          ) : null}

          <nav
            className={classes.PrimaryNavigation}
            aria-label={labels.primaryNavigation}
          >
            <ul>
              {desktopPrimaryItems.map((item) => {
                const isGuideItem = item.id === guidePrimaryId;
                const isProductItem = item.id === productPrimaryId;
                const dropdownName =
                  isGuideItem && guideCategories.length
                    ? 'guides'
                    : isProductItem && productItems.length
                      ? 'products'
                      : null;

                return (
                  <li
                    key={item.id}
                    ref={
                      isGuideItem
                        ? guideTriggerRef
                        : isProductItem
                          ? productTriggerRef
                          : undefined
                    }
                    id={dropdownName ? `${idPrefix}-${dropdownName}-trigger` : undefined}
                    className={`${classes.PrimaryItem} ${
                      dropdownName ? classes.DropdownPrimaryItem : ''
                    }`}
                    data-dropdown-open={
                      dropdownName ? String(openTray === dropdownName) : undefined
                    }
                    onMouseEnter={() => {
                      if (dropdownName) {
                        setOpenTray(dropdownName);
                      } else if (openTray === 'guides' || openTray === 'products') {
                        closeTray(false);
                      }
                    }}
                  >
                    <PrimaryNavigationLink
                      item={item}
                      className={classes.PrimaryLink}
                      iconClassName={classes.PrimaryIcon}
                      labelClassName={classes.PrimaryLabel}
                    />
                    {dropdownName ? (
                      <span className={classes.TrayIndicator} aria-hidden="true" />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className={classes.Utilities}
            onMouseEnter={() => {
              if (openTray === 'guides' || openTray === 'products') {
                closeTray(false);
              }
            }}
          >
            {searchItems?.length ? (
              <SiteSearch
                searchItems={searchItems}
                variant="navbar"
                label={labels.searchLabel}
                clearLabel={labels.clearSearch}
                resultLimit={5}
              />
            ) : null}
            <CartButton language={language} copy={copy.cart} />
            <ThemeToggler copy={copy.theme} />
            <button
              ref={secondaryTriggerRef}
              id={`${idPrefix}-secondary-trigger`}
              type="button"
              className={classes.SecondaryToggle}
              aria-expanded={openTray === 'secondary'}
              aria-controls={secondaryTrayId}
              onClick={() => toggleTray('secondary')}
            >
              {labels.more}
            </button>
          </div>
          <WormBurrowTrail containerRef={commandBarRef} surface="desktop" />
        </div>
      </div>

      {openTray === 'guides' ? (
        <DesktopNavigationTray
          id={guideTrayId}
          labelledBy={`${idPrefix}-guide-trigger`}
          type="guides"
          guideCategories={guideCategories}
          searchItems={searchItems}
          labels={labels}
          onNavigate={() => closeTray(false)}
        />
      ) : null}

      {openTray === 'products' ? (
        <DesktopNavigationTray
          id={productTrayId}
          labelledBy={`${idPrefix}-products-trigger`}
          type="products"
          productItems={productItems}
          onNavigate={() => closeTray(false)}
        />
      ) : null}

      {openTray === 'secondary' ? (
        <DesktopNavigationTray
          id={secondaryTrayId}
          labelledBy={`${idPrefix}-secondary-trigger`}
          type="secondary"
          secondarySections={secondarySections}
          settingsSection={settingsSection}
          labels={labels}
          copy={copy}
          onNavigate={() => closeTray(false)}
        />
      ) : null}

      {showGuideContext ? (
        <nav className={classes.ContextNavigation} aria-label={labels.guideContext}>
          <div className={classes.ContextInner}>
            <span>{labels.guideCategories}</span>
            <ul>
              {guideCategories.map((category) => {
                const categoryPath = normalizeNavigationPath(category.href);
                const isCurrent =
                  normalizedPathname === categoryPath ||
                  normalizedPathname.startsWith(`${categoryPath}/`);

                return (
                  <li key={category.href}>
                    <NavigationAuxiliaryLink item={category} isCurrent={isCurrent} />
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
