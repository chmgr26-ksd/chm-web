import '@chm/design-system/tokens.css';
import './globals.css';

export const metadata = {
  title: 'CHM Group',
  description: '지역과 함께 성장하는 생활환경 관리 전문기업 — Community Housing Management Group',
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
        {children}
      </body>
    </html>
  );
}
