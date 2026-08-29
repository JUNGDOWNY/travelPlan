import type { NextConfig } from "next";

// GitHub Pages(프로젝트 페이지)는 https://<user>.github.io/<repo>/ 경로로 서비스되므로
// basePath / assetPrefix 가 필요하다. 로컬 개발(next dev)에서는 비워둔다.
const isProd = process.env.NODE_ENV === "production";
const repo = "auroraTravel";

const nextConfig: NextConfig = {
  output: "export", // 정적 HTML로 내보내기 (out/)
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  images: { unoptimized: true }, // 정적 배포에서는 이미지 최적화 서버가 없다
  trailingSlash: true,
};

export default nextConfig;
