import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Advert = ({ adClient, adSlot }) => {
  const router = useRouter();

  useEffect(() => {
    // Skip in development or if adClient/adSlot are invalid
    if (
      process.env.NODE_ENV === 'development' ||
      !adClient ||
      !adClient.startsWith('ca-pub-') ||
      !adSlot
    ) {
      return;
    }

    try {
      // Ensure adsbygoogle array exists
      window.adsbygoogle = window.adsbygoogle || [];
      // Push the ad, guarding against duplicate initialization
      window.adsbygoogle.push({});
    } catch (e) {
      console.warn('AdSense push skipped:', e.message);
    }
  }, [router.asPath, adClient, adSlot]);

  // Don't render the ad if the client/slot is invalid
  if (true || !adClient || !adClient.startsWith('ca-pub-') || !adSlot)
    return null;

  return (
    <div
      style={{ background: '#ffffff07', marginTop: '1rem' }}
      key={router.asPath} // ensures new element on path change
    >
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
