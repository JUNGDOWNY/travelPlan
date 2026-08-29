import type { NextConfig } from "next";

// GitHub Pages(프로젝트 페이지)는 https://<user>.github.io/<repo>/ 경로로 서비스되므로
// basePath / assetPrefix 가 필요하다. 로컬 개발(next dev)에서는 비워둔다.
//
// GitHub Actions 에서는 GITHUB_REPOSITORY("owner/repo") 로 저장소 이름을 알아내므로
// 저장소 이름을 바꿔도 설정을 고칠 필요가 없다.
// <user>.github.io 저장소(사용자 페이지)는 루트로 서비스되므로 basePath 가 없어야 한다.
const isProd = process.env.NODE_ENV === "production";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "auroraTravel";
const needsBasePath = isProd && !repo.endsWith(".github.io");

const basePath = needsBasePath ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export", // 정적 HTML로 내보내기 (out/)
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  images: { unoptimized: true }, // 정적 배포에서는 이미지 최적화 서버가 없다
  trailingSlash: true,
};

export default nextConfig;
