import localFont from 'next/font/local';
import '@chm/design-system/tokens.css';
import './globals.css';
import Providers from '../components/site/Providers';
import SentryClient from '../components/site/SentryClient';

// 웹폰트 셀프호스팅 — next/font/local이 빌드 시 최적화·preload하고 런타임 CDN 의존을 제거.
// 노출한 CSS 변수를 globals.css(DS 토큰)·tailwind preset의 폰트 스택 맨 앞에 연결한다.
const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920', // 가변 폰트 전체 굵기 범위
  style: 'normal',
});

const montserrat = localFont({
  src: [
    { path: './fonts/Montserrat-600.woff2', weight: '600', style: 'normal' },
    { path: './fonts/Montserrat-700.woff2', weight: '700', style: 'normal' },
    { path: './fonts/Montserrat-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-montserrat',
  display: 'swap',
});

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
    <html lang="ko" className={`${pretendard.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-ink-50 text-ink-800 antialiased">
        <SentryClient />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
