'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

const ADS_TEMPORARILY_DISABLED = true;

const Advert = ({ adClient, adSlot }) => {
  const pathname = usePathname();
  const hasValidAdConfig = adClient && adClient.startsWith('ca-pub-') && adSlot;
  const canRenderAd = !ADS_TEMPORARILY_DISABLED && hasValidAdConfig;

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' || !canRenderAd) {
      return;
    }

    const requestAd = () => {
      if (
        window.__lieromaaAdSenseStatus !== 'ready' ||
        !window.__lieromaaAdsConsentGranted
      ) {
        return;
      }

      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (e) {
        console.warn('AdSense push skipped:', e.message);
      }
    };

    requestAd();
    window.addEventListener('lieromaa:adsense-ready', requestAd);
    window.addEventListener('lieromaa:ads-consent-granted', requestAd);

    return () => {
      window.removeEventListener('lieromaa:adsense-ready', requestAd);
      window.removeEventListener('lieromaa:ads-consent-granted', requestAd);
    };
  }, [pathname, canRenderAd]);

  if (!canRenderAd) return null;

  return (
    <div style={{ background: '#ffffff07', marginTop: '1rem' }} key={pathname}>
      <div>Mainos</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default Advert;
