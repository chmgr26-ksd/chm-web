/** @type {import('next').NextConfig} */
const nextConfig = {
  // 디자인 시스템은 미컴파일 JSX 소스이므로 Next가 트랜스파일하게 함
  transpilePackages: ['@chm/design-system'],
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    // 프로덕션 빌드에서 webpack 영속 캐시 비활성화.
    // 일부 호스팅 빌드 환경의 스테일 .next/cache가 존재하지 않는 청크를
    // 참조(ChunkLoadError 404)하는 문제를 방지 — 항상 일관된 청크 그래프 생성.
    if (!dev) config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
