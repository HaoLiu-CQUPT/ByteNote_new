/** @type {import('next').NextConfig} */
const nextConfig = {
  // 禁用静态优化，因为这是动态路由
  output: "standalone",
  // 确保动态路由正确工作
  experimental: {
    // 不需要特殊配置
  },
  // 修复 chunk 加载问题
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
