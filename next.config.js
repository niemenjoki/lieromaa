const nextConfig = {
  env: {
    NEXT_PUBLIC_ADSENSE_ENABLED: process.env.ADSENSE_ENABLED ?? '0',
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
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
