/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval'; # WARNING: 'unsafe-eval' is used for development/testing due to Webpack/Next.js HMR. REMOVE FOR PRODUCTION!
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data:;
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              block-all-mixed-content;
              upgrade-insecure-requests;
              connect-src 'self' https://tidal-power-backend.onrender.com; # Allow connection to deployed backend
            `.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};

// Trigger rebuild - 2024-11-24
module.exports = nextConfig;
