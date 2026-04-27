/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // 在生产构建时禁用ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在生产构建时禁用类型检查
    ignoreBuildErrors: false,
  },
}

export default nextConfig
