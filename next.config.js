/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['wallpapers.com', 'wallpapercave.com', 'encrypted-tbn0.gstatic.com', 'image-cdn.hypb.st', 's9oawqeuub.ufs.sh']
  },
  webpack: (config) => {
    // Abaikan parsing untuk modul chrome-aws-lambda
    config.externals = config.externals || [];
    config.externals.push({
      'chrome-aws-lambda': 'commonjs chrome-aws-lambda',
    });
    config.optimization.minimize = false;

    return config;
  },
};

module.exports = nextConfig;
