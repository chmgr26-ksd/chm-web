import '@chm/design-system/tokens.css';
import './globals.css';

export const metadata = {
  title: 'CHM Group',
  description: '지역과 함께 성장하는 생활환경 관리 전문기업 — Community Housing Management Group',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-ink-50 text-ink-800 antialiased">{children}</body>
    </html>
  );
}
