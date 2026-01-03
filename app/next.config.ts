import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // 启用静态导出
  images: {
    unoptimized: true,  // GitHub Pages 不支持 Next.js 图片优化
  },
  // 如果部署到子路径，取消下面的注释并设置正确的路径
  // basePath: '/SCL90',
  // assetPrefix: '/SCL90',
};

export default nextConfig;
