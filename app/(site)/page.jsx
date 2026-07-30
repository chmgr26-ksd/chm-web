import NoticeHero from '@/components/landing/NoticeHero';
import Hero from '@/components/landing/Hero';
import MissionVision from '@/components/landing/MissionVision';
import CoreValues from '@/components/landing/CoreValues';
import BusinessAreas from '@/components/landing/BusinessAreas';
import { getSiteImageVersions, getSiteImageMimes, getRecentNotices, getNoticeHeroConfig, siteImageUrl, isVideoMime } from '@/lib/siteContent';

// 랜딩 페이지 — chm-group-design 디자인 이식('따뜻한 온기' 팔레트 고정).
// 헤더/푸터는 (site) 레이아웃의 SiteHeader/SiteFooter를 그대로 사용.
// 히어로 이미지는 관리자 교체 가능(landing-hero 슬롯).
// 최상단에 공지 배너 롤러(NoticeHero) — 실제 공지(Post) 연동.
export default async function LandingPage() {
  const [versions, mimes, notices, noticeConfig] = await Promise.all([
    getSiteImageVersions(),
    getSiteImageMimes(),
    getRecentNotices(),
    getNoticeHeroConfig(),
  ]);
  return (
    <div className="bg-chm-bg font-sans text-chm-text selection:bg-chm-primary/20">
      <NoticeHero notices={notices} config={noticeConfig} />
      <Hero
        heroUrl={siteImageUrl('landing-hero', versions)}
        heroKind={isVideoMime(mimes['landing-hero']) ? 'video' : 'image'}
        heroPoster={siteImageUrl('landing-hero-poster', versions)}
      />
      <MissionVision />
      <CoreValues />
      <BusinessAreas />
    </div>
  );
}
