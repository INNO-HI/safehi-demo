/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoBase = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  // 정적 export 모드 (GitHub Pages용). dev에서는 일반 SSR.
  output: isProd ? 'export' : 'standalone',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isProd ? repoBase : '',
  assetPrefix: isProd ? repoBase : '',
};

export default nextConfig;
