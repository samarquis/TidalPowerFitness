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
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.squareup.com https://*.squarecdn.com https://*.acuityscheduling.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https://*.squareup.com https://*.squarecdn.com;
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-src 'self' https://*.squareup.com https://*.squarecdn.com https://*.acuityscheduling.com;
              frame-ancestors 'none';
              block-all-mixed-content;
              upgrade-insecure-requests;
              connect-src 'self' http://localhost:5000 https://tidal-power-backend.onrender.com https://*.squareup.com https://*.squarecdn.com;
            `.replace(/\n/g, '').replace(/#.*$/, ''),
          },
        ],
      },
    ];
  },
};

// Trigger rebuild - 2024-11-24
module.exports = nextConfig;
