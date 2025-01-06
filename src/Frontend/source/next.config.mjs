// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  devIndicators: {
    reactRefresh: false,
  },
  images: {
    domains: ['localhost'], // Allow images to be loaded from localhost
  },
};

export default nextConfig;
