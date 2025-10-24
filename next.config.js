const nextConfig = {
  async headers() {
    return [
      {
        source: '/:all*(png|jpg|jpeg|webp|avif|ico|svg)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
