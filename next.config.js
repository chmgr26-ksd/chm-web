/** @type {import('next').NextConfig} */
const nextConfig = {
  // 디자인 시스템은 미컴파일 JSX 소스이므로 Next가 트랜스파일하게 함
  transpilePackages: ['@chm/design-system'],
  reactStrictMode: true,
  // 참고: 예전에 config.cache=false로 webpack 영속 캐시를 껐으나, 이는 캐시를
  //   메모리에 유지시켜 제약된 빌드 환경(Hostinger)에서 OOM 위험을 높였고,
  //   원래 목적(ChunkLoadError)은 CDN 캐싱이 원인으로 판명됨 + prebuild(rm -rf .next)가
  //   이미 클린 빌드를 보장하므로 제거함. webpack 기본 파일시스템 캐시 사용(디스크 오프로드).
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
