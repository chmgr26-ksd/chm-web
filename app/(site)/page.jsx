import Hero from '@/components/landing/Hero';
import MissionVision from '@/components/landing/MissionVision';
import CoreValues from '@/components/landing/CoreValues';
import BusinessAreas from '@/components/landing/BusinessAreas';

// 랜딩 페이지 — chm-group-design 디자인 이식('따뜻한 온기' 팔레트 고정).
// 헤더/푸터는 (site) 레이아웃의 SiteHeader/SiteFooter를 그대로 사용.
// 정적 콘텐츠라 DB 접근 없음 → 완전 정적 생성.
export default function LandingPage() {
  return (
    <div className="bg-chm-bg font-sans text-chm-text selection:bg-chm-primary/20">
      <Hero />
      <MissionVision />
      <CoreValues />
      <BusinessAreas />
    </div>
  );
}
