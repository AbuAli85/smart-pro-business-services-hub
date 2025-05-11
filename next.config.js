/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["v0.blob.com"],
    unoptimized: true,
  },
  // Disable experimental features that might be causing issues
  experimental: {
    // Disable optimizeCss to avoid critters dependency
    optimizeCss: false,
    
    // Disable esmExternals to avoid module resolution issues
    esmExternals: false,
  },
  // Increase memory limit for webpack
  webpack: (config, { isServer }) => {
    // Increase memory limit for webpack
    config.performance = {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    }

    // Fix for "exports is not defined" error
    config.module = {
      ...config.module,
      exprContextCritical: false,
      rules: [
        ...config.module.rules,
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false, // Disable the requirement for extension in import
          },
        },
      ],
    }

    // Ensure proper module resolution
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      },
    }

    // Simplify chunk naming to avoid issues
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Create a single vendor chunk for all node_modules
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 20,
          },
          // Create a commons chunk for shared code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    }

    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
