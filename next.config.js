/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // 启用静态导出，用于 GitHub Pages
  images: {
    unoptimized: true, // 静态导出需要禁用图片优化
  },
  basePath: '/gilded-oracle', // GitHub Pages 仓库名称
  assetPrefix: '/gilded-oracle', // 资源前缀
}

export default nextConfig
