import SiteHeader from '../../components/site/SiteHeader';
import SiteFooter from '../../components/site/SiteFooter';
import Analytics from '../../components/site/Analytics';
import { getContact } from '@/lib/siteContent';

// 공개 사이트 공용 셸 — 헤더(공지바+네비) + 콘텐츠 + 푸터.
// SiteHeader는 클라이언트 컴포넌트라 후기폼 URL을 서버에서 prop으로 주입.
export default async function SiteLayout({ children }) {
  const { reviewFormUrl } = await getContact();
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Analytics />
      <SiteHeader reviewFormUrl={reviewFormUrl} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
