/** @type {import('next').NextConfig} */
const r2Host = process.env.R2_PUBLIC_BASE_URL ? new URL(process.env.R2_PUBLIC_BASE_URL).hostname : undefined
const nextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    // Allow optimization for Cloudflare R2 or custom CDN host
    remotePatterns: [
      ...(r2Host ? [{ protocol: 'https', hostname: r2Host }] : []),
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'pub-30e84c28bcc645f895ca4d0f4b22a9c7.r2.dev' },
      { protocol: 'https', hostname: 'assets.your-domain.com' },
    ],
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features (none required; server actions are default)

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
