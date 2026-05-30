
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.forEach((rule) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((oneOfRule) => {
          if (
            oneOfRule.use &&
            oneOfRule.use.loader &&
            oneOfRule.use.loader.includes('next-style-loader')
          ) {
            oneOfRule.use.options.postcss = {
              plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
              ],
            };
          }
        });
      }
    });
    return config;
  },
};

module.exports = nextConfig;
