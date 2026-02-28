import Script from 'next/script';

const ADSENSE_CLIENT = 'ca-pub-5560402633923389';
const FUNDING_CHOICES_PUBLISHER = ADSENSE_CLIENT.replace(/^ca-/, '');

const consentBootstrap = `
  (function () {
    if (typeof window === 'undefined') return;

    var ADSENSE_SCRIPT_ID = 'lieromaa-adsense-script';
    var ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}';

    window.__lieromaaAdsConsentGranted = Boolean(window.__lieromaaAdsConsentGranted);
    window.__lieromaaAdSenseStatus = window.__lieromaaAdSenseStatus || 'idle';

    function emit(eventName) {
      window.dispatchEvent(new CustomEvent(eventName));
    }

    function getAllowedConsentStatuses() {
      var statusEnum = window.googlefc && window.googlefc.ConsentModePurposeStatusEnum;

      if (!statusEnum) return [];

      return [
        statusEnum.CONSENT_MODE_PURPOSE_STATUS_GRANTED,
        statusEnum.CONSENT_MODE_PURPOSE_STATUS_NOT_APPLICABLE,
        statusEnum.CONSENT_MODE_PURPOSE_STATUS_NOT_CONFIGURED,
      ];
    }

    function hasGrantedAdStorage(consentValues) {
      if (!consentValues) return false;

      var allowedStatuses = getAllowedConsentStatuses();
      return allowedStatuses.indexOf(consentValues.adStoragePurposeConsentStatus) !== -1;
    }

    function loadAdSenseScript() {
      if (
        window.__lieromaaAdSenseStatus === 'loading' ||
        window.__lieromaaAdSenseStatus === 'ready'
      ) {
        return;
      }

      if (document.getElementById(ADSENSE_SCRIPT_ID)) {
        window.__lieromaaAdSenseStatus = 'ready';
        emit('lieromaa:adsense-ready');
        return;
      }

      window.__lieromaaAdSenseStatus = 'loading';

      var script = document.createElement('script');
      script.id = ADSENSE_SCRIPT_ID;
      script.async = true;
      script.src = ADSENSE_SRC;
      script.crossOrigin = 'anonymous';
      script.onload = function () {
        window.__lieromaaAdSenseStatus = 'ready';
        emit('lieromaa:adsense-ready');
      };
      script.onerror = function () {
        window.__lieromaaAdSenseStatus = 'idle';
      };

      document.head.appendChild(script);
    }

    function evaluateConsentAndLoadAds() {
      if (!window.googlefc || typeof window.googlefc.getGoogleConsentModeValues !== 'function') {
        return;
      }

      var consentValues = window.googlefc.getGoogleConsentModeValues();
      var wasGranted = window.__lieromaaAdsConsentGranted;
      var isGranted = hasGrantedAdStorage(consentValues);

      window.__lieromaaAdsConsentGranted = isGranted;

      if (!wasGranted && isGranted) {
        emit('lieromaa:ads-consent-granted');
      }

      if (isGranted) {
        loadAdSenseScript();
      }
    }

    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];

    window.googlefc.callbackQueue.push({
      CONSENT_MODE_DATA_READY: function () {
        try {
          evaluateConsentAndLoadAds();
        } catch (_) {}
      },
    });

    window.googlefc.callbackQueue.push({
      CONSENT_API_READY: function () {
        if (typeof window.__tcfapi !== 'function') return;

        window.__tcfapi('addEventListener', 2.2, function () {
          try {
            evaluateConsentAndLoadAds();
          } catch (_) {}
        });
      },
    });
  })();
`;

export default function AdSenseConsentGate() {
  return (
    <>
      <Script id="google-funding-choices-bootstrap" strategy="afterInteractive">
        {consentBootstrap}
      </Script>
      <Script
        async
        id="google-funding-choices"
        strategy="afterInteractive"
        src={`https://fundingchoicesmessages.google.com/i/${FUNDING_CHOICES_PUBLISHER}?ers=1`}
      />
    </>
  );
}
