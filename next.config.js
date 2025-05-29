/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.sanity.io',
      'images.unsplash.com',
      'plus.unsplash.com'
    ],
    formats: ['image/avif', 'image/webp'],
  },
  webpack(config) {
    // Support for GLSL shader files in Three.js
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });
    return config;
  },
}

module.exports = nextConfig
