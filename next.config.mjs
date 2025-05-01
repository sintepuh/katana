/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },
    images: {
        formats: ['image/avif','image/webp'],
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'fra.cloud.appwrite.io',
            port: '',
            pathname: '/v1/storage/buckets/**',
          },
        ],
      },
};

export default nextConfig;
