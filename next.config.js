const nextConfig = {
  allowedDevOrigins: ['192.168.0.10'],
  env: {
    NEXT_PUBLIC_ADSENSE_ENABLED: process.env.ADSENSE_ENABLED ?? '0',
  },
  outputFileTracingIncludes: {
    '/en': ['./generated/commerce/sales-milestones.json'],
    '/tuotteet': ['./generated/commerce/sales-milestones.json'],
  },
  async headers() {
    return [
      {
        source: '/:all*(png|jpg|jpeg|webp|avif|ico|svg)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/madot',
        destination: '/tuotteet/madot',
        permanent: true,
      },
      {
        source: '/tuotteet/matokompostin-aloituspakkaus',
        destination: '/tuotteet/madot#valmis-matokompostori',
        permanent: true,
      },
      {
        source:
          '/opas/kompostorin-hoito/matokompostointi-talvella-toimiiko-se-ulkona-suomessa',
        destination:
          '/opas/kompostorin-perustaminen/matokompostointi-talvella-toimiiko-se-ulkona-suomessa',
        permanent: true,
      },
      {
        source:
          '/opas/kompostorin-perustaminen/voiko-kompostimadot-laittaa-lampokompostoriin',
        destination:
          '/opas/lämpökompostointi/voiko-kompostimadot-laittaa-lampokompostoriin',
        permanent: true,
      },
      {
        source:
          '/opas/kompostin-hyödyntäminen/kompostitee-matokakasta-valmistus-ja-kaytto',
        destination:
          '/opas/kompostin-hyödyntäminen/matotee-matokakasta-valmistus-ja-kaytto',
        permanent: true,
      },
      {
        source: '/opas/l%C3%A4mp%C3%B6kompostointi/miten-lampokompostori-toimii',
        destination:
          '/opas/lämpökompostointi/lampokompostori-ei-lampene#kompostori-ei-ole-lammon-lahde',
        permanent: true,
      },
      {
        source:
          '/opas/l%C3%A4mp%C3%B6kompostointi/lampokompostorin-kosteus-happi-ja-kuivike',
        destination:
          '/opas/lämpökompostointi/lampokompostori-ei-lampene#vihreat-ruskeat-ja-kuivike',
        permanent: true,
      },
      {
        source:
          '/opas/l%C3%A4mp%C3%B6kompostointi/lampokompostorin-lampotila-ja-talvikompostointi',
        destination:
          '/opas/lämpökompostointi/lampokompostori-ei-lampene#viilea-ei-ole-sama-kuin-toimimaton',
        permanent: true,
      },
      {
        source: '/opas/l%C3%A4mp%C3%B6kompostointi/lampokompostorin-kaytto-ja-hoito',
        destination:
          '/opas/lämpökompostointi/lampokompostori-ei-lampene#arkinen-havaintomalli',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
