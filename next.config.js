// Set when building in the GitHub Pages workflow, since the site is served
// from https://<user>.github.io/qr_generator/ instead of the domain root.
const repoBasePath = process.env.GITHUB_PAGES === 'true' ? '/qr_generator' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: repoBasePath,
  assetPrefix: repoBasePath,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig