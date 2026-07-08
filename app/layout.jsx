import '@chm/design-system/tokens.css';
import './globals.css';
import Providers from '../components/site/Providers';
import SentryClient from '../components/site/SentryClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://forestgreen-sheep-120944.hostingersite.com';
const SITE_DESC =
  '대전 유성구 어은동 기반 생활환경 관리 전문기업. 집수리 서비스·집수리 교실·마을관리사업단으로 주민의 자립과 지역의 지속가능한 성장을 돕습니다.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CHM Group — 지역과 함께 성장하는 생활환경 관리',
    template: '%s · CHM Group',
  },
  description: SITE_DESC,
  applicationName: 'CHM Group',
  keywords: ['CHM Group', '씨에이치엠그룹', '집수리', '생활환경 관리', '마을관리사업단', '집수리 교실', '대전 유성구', '어은동', '자원봉사'],
  authors: [{ name: 'CHM Group' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: 'CHM Group',
    title: 'CHM Group — 지역과 함께 성장하는 생활환경 관리',
    description: SITE_DESC,
    images: [{ url: '/logo.png', alt: 'CHM Group' }],
  },
  twitter: {
    card: 'summary',
    title: 'CHM Group — 지역과 함께 성장하는 생활환경 관리',
    description: SITE_DESC,
    images: ['/logo.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-ink-50 text-ink-800 antialiased">
        {/* 웹폰트 — Pretendard(본문/제목) + Montserrat(숫자·영문 라벨).
            DS 토큰이 실제 패밀리명("Pretendard"/"Montserrat")을 참조하므로
            패밀리명을 보존하는 CDN 스타일시트로 로드. Next가 <head>로 hoist함. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap"
        />
        <SentryClient />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
