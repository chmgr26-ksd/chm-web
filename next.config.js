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
  // 배포 캐시 정책 — 배포마다 수동 CDN 퍼지 부담 제거.
  // 원리: 콘텐츠 해시가 붙은 정적 자산(/_next/static/*)은 Next 기본값(1년 immutable)을
  //   그대로 두고, HTML 문서 등 나머지는 "매 요청 재검증"으로 강제.
  //   → CDN이 삭제된 청크를 참조하는 오래된 HTML을 서빙하지 못함(ChunkLoadError 방지).
  async headers() {
    return [
      {
        // /_next/static/* 와 /_next/image 는 제외(불변 캐시 유지), 그 외 전부 매치.
        source: '/((?!_next/static/|_next/image).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
