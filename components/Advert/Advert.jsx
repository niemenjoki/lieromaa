'use client';

import { useEffect, useRef, useState } from 'react';

import { usePathname } from 'next/navigation';

import {
  ADSENSE_CLIENT,
  ADSENSE_DEFAULT_SLOT,
  ADSENSE_ENABLED,
} from '@/lib/site/adsense';

import classes from './Advert.module.css';

const AD_LOAD_TIMEOUT_MS = 12000;

function getAdSlotState(adElement, { allowFrameFallback = false } = {}) {
  if (!adElement) return 'pending';

  const adStatus = adElement.getAttribute('data-ad-status');

  if (adStatus === 'unfilled') return 'hidden';
  if (adStatus === 'filled') return 'filled';
  if (allowFrameFallback && adElement.querySelector('iframe')) return 'filled';

  return 'pending';
}

const Advert = ({ adClient = ADSENSE_CLIENT, adSlot = ADSENSE_DEFAULT_SLOT }) => {
  const pathname = usePathname();
  const adRef = useRef(null);
  const pushRequestedRef = useRef(false);
  const [isEligible, setIsEligible] = useState(false);
  const [slotState, setSlotState] = useState('idle');
  const hasValidAdConfig = adClient && adClient.startsWith('ca-pub-') && adSlot;
  const canRenderAd =
    process.env.NODE_ENV === 'production' && ADSENSE_ENABLED && hasValidAdConfig;

  useEffect(() => {
    pushRequestedRef.current = false;
    setIsEligible(false);
    setSlotState('idle');
  }, [pathname, adClient, adSlot]);

  useEffect(() => {
    if (!canRenderAd) {
      return;
    }

    const updateEligibility = () => {
      const nextIsEligible =
        window.__lieromaaAdSenseStatus === 'ready' &&
        Boolean(window.__lieromaaAdsConsentGranted);

      setIsEligible(nextIsEligible);
      setSlotState((currentSlotState) => {
        if (!nextIsEligible) {
          pushRequestedRef.current = false;
          return 'idle';
        }

        return currentSlotState === 'idle' ? 'pending' : currentSlotState;
      });
    };

    updateEligibility();
    window.addEventListener('lieromaa:adsense-ready', updateEligibility);
    window.addEventListener('lieromaa:ads-consent-granted', updateEligibility);
    window.addEventListener('lieromaa:analytics-consent-changed', updateEligibility);

    return () => {
      window.removeEventListener('lieromaa:adsense-ready', updateEligibility);
      window.removeEventListener('lieromaa:ads-consent-granted', updateEligibility);
      window.removeEventListener('lieromaa:analytics-consent-changed', updateEligibility);
    };
  }, [pathname, canRenderAd, adClient, adSlot]);

  useEffect(() => {
    if (!canRenderAd || !isEligible || slotState !== 'pending') {
      return;
    }

    const adElement = adRef.current;

    if (!adElement || pushRequestedRef.current) {
      return;
    }

    const updateSlotState = () => {
      setSlotState(getAdSlotState(adElement));
    };

    const observer = new MutationObserver(updateSlotState);
    const timeoutId = window.setTimeout(() => {
      const nextSlotState = getAdSlotState(adElement, { allowFrameFallback: true });

      setSlotState((currentSlotState) => {
        if (currentSlotState !== 'pending') return currentSlotState;
        return nextSlotState === 'pending' ? 'hidden' : nextSlotState;
      });
    }, AD_LOAD_TIMEOUT_MS);

    observer.observe(adElement, {
      attributes: true,
      attributeFilter: ['data-ad-status', 'style'],
      childList: true,
      subtree: true,
    });

    try {
      pushRequestedRef.current = true;
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      updateSlotState();
    } catch (e) {
      console.warn('AdSense push skipped:', e.message);
      setSlotState('hidden');
    }

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [pathname, canRenderAd, isEligible, slotState, adClient, adSlot]);

  if (!canRenderAd || !isEligible || slotState === 'idle' || slotState === 'hidden') {
    return null;
  }

  return (
    <aside
      aria-hidden={slotState !== 'filled'}
      aria-label="Mainos"
      className={`${classes.Advert} ${
        slotState === 'filled' ? classes.Visible : classes.Pending
      }`}
      key={pathname}
    >
      <p className={classes.Label}>Mainos</p>
      <ins
        ref={adRef}
        className={`adsbygoogle ${classes.Slot}`}
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
};

export default Advert;
