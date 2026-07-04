'use client';

import Link from 'next/link';
import {
  Logo, Button, Container, PageHero, FeatureCard, Stat, Badge,
} from '@chm/design-system';

export default function HomePage() {
  return (
    <main>
      {/* 상단 바 */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
        <Container size="xl" className="flex h-16 items-center justify-between">
          <Logo variant="full" size={26} />
          <nav className="hidden items-center gap-1 md:flex">
            {['소개', '사업·활동', '소식·공지', '후원', '문의'].map((n) => (
              <a key={n} href="#" className="rounded-chm-md px-3 py-2 text-body-sm font-semibold text-ink-600 hover:bg-ink-100">{n}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login"><Button variant="ghost" tone="ink" size="sm">로그인</Button></Link>
            <Button size="sm">집수리 신청</Button>
          </div>
        </Container>
      </header>

      <PageHero
        eyebrow="지역과 함께 성장하는 생활환경 관리 전문기업"
        title={<>사람을 키우고,<br /><span className="text-trust-600">집을 고치고,</span> 마을을 연결한다</>}
        description="주민의 기술과 참여로 주거와 생활환경의 문제를 해결하고, 지속가능한 일자리와 공동체를 만듭니다."
        actions={<>
          <Button size="lg">집수리 신청하기</Button>
          <Link href="/dashboard"><Button size="lg" variant="outline">대시보드 보기</Button></Link>
        </>}
      />

      <section className="py-14">
        <Container size="xl" className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-overline font-bold uppercase tracking-wide text-trust-600">Our Services</span>
            <h2 className="text-h2 font-bold text-ink-800">우리가 하는 일</h2>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <FeatureCard value="trust" title="주거관리 서비스" description="저층 주거지 집수리·단열·누수 보수를 전문 인력이 안전하게 수행합니다." />
            <FeatureCard value="cooperation" title="점포관리·상권활성화" description="지역 상인과 함께 상권을 되살리는 점포 관리 서비스." />
            <FeatureCard value="community" title="지역 돌봄·생활지원" description="주민이 주민을 돌보는 따뜻한 마을 생활지원 서비스." />
          </div>
        </Container>
      </section>

      <section className="bg-surface py-14">
        <Container size="xl" className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <h2 className="text-h2 font-bold text-ink-800">숫자로 보는 CHM Group</h2>
            <Badge value="trust" dot>2026 상반기</Badge>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <Stat label="누적 집수리" value="1,284" unit="건" accent="trust" trend={{ dir: 'up', text: '+18%' }} />
            <Stat label="양성 기술인력" value="47" unit="명" accent="selfreliance" trend={{ dir: 'up', text: '+6명' }} />
            <Stat label="참여 사업단" value="9" unit="개동" accent="cooperation" />
            <Stat label="회원 만족도" value="96" unit="%" accent="innovation" trend={{ dir: 'up', text: '+2%p' }} />
          </div>
        </Container>
      </section>

      <footer className="border-t border-border bg-ink-900 py-10 text-ink-300">
        <Container size="xl" className="flex flex-col gap-3">
          <Logo variant="full" size={24} inverse />
          <p className="text-body-sm text-ink-400">(주)씨에이치엠그룹 · Community Housing Management Group · 사람을 키우고, 집을 고치고, 마을을 연결한다.</p>
        </Container>
      </footer>
    </main>
  );
}
