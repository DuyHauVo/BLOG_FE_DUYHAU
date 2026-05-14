/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Suppress warnings from hydration mismatch (often caused by extensions)
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig;
