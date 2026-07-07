import SiteHeader from '../../components/site/SiteHeader';
import SiteFooter from '../../components/site/SiteFooter';
import Analytics from '../../components/site/Analytics';

// 공개 사이트 공용 셸 — 헤더(공지바+네비) + 콘텐츠 + 푸터.
export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Analytics />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
