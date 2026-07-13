import Link from 'next/link';
import {
  Container, Button, PageHero, StatBand, ValueDotStrip,
} from '@chm/design-system';
import { getContact, getSiteImageVersions, siteImageUrl } from '@/lib/siteContent';
import { prisma } from '@/lib/prisma';
import { POST_CATEGORY } from '@/lib/posts';

// 최근 소식을 DB에서 읽되 메인은 정적 유지(ISR, 5분마다 재생성).
export const revalidate = 300;

export const metadata = { title: '메인' };

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())}`;
}

const SERVICES = [
  { no: '01', value: 'selfreliance', title: '집수리 서비스', desc: '방충망·수전·조명 같은 경수리부터 정기 점검까지. 표준 단가와 품질보증으로 믿고 맡길 수 있습니다.' },
  { no: '02', value: 'trust', title: '집수리 교실', desc: '주민 누구나 기초 수리 기술을 배웁니다. 교육 → 실습 → 현장 투입으로 이어지는 성장 과정을 운영합니다.' },
  { no: '03', value: 'sustainability', title: '마을관리사업단', desc: '행정동 단위로 조직된 주민 사업단이 동네를 상시 관리합니다. 주민이 주민을 돕는 구조입니다.' },
];

const STEPS = [
  { n: 1, value: 'selfreliance', title: '신청·문의', desc: '홈페이지나 전화로 필요한 수리를 알려주세요.' },
  { n: 2, value: 'trust', title: '방문 견적', desc: '이웃 기술자가 방문해 표준 단가로 견적을 드립니다.' },
  { n: 3, value: 'cooperation', title: '수리 시공', desc: '약속한 일정에 책임 시공하고 결과를 확인받습니다.' },
  { n: 4, value: 'sustainability', title: '정기 점검', desc: '수리 이후에도 주기적으로 집 상태를 살핍니다.' },
];

export default async function MainPage() {
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
  const c = await getContact();
  const versions = await getSiteImageVersions();
  return (
    <>
      {/* ── 히어로(신뢰형) ── */}
      <PageHero
        eyebrow="대전 유성구 · 지역 기반 주거관리 사회적기업"
        title={<><span className="text-cta">사람</span>을 키우고, <span className="text-primary">집</span>을 고치고, <span className="text-sustainability-600">마을</span>을 연결한다</>}
        description="주민이 직접 배우고 참여하는 동네 집수리 서비스. 작은 수리부터 정기 점검까지, 믿을 수 있는 이웃 기술자가 찾아갑니다."
        actions={<>
          <Button as={Link} href="/apply" tone="cta" size="lg">집수리 신청</Button>
          <Button as={Link} href="/business" variant="outline" tone="primary" size="lg">사업 소개 보기</Button>
        </>}
        media={
          // PageHero의 media 래퍼가 justify-end라 폭 미지정 시 내용 크기로 축소됨 → 폭을 명시.
          // 프레임(사진+배지)을 컬럼의 90%로 두어 약간 작게 표시.
          <div className="w-[90%]">
            <div className="overflow-hidden rounded-chm-lg border border-border">
              <img
                src={siteImageUrl('main-field', versions)}
                alt="집수리교실 현장 — 집수리 작업 모습"
                width={300}
                height={225}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            {/* 배지는 사진 아래에 배치(겹침 방지). */}
            <div className="mt-3 flex items-center gap-3.5 rounded-chm-lg border border-border bg-surface p-4 shadow-chm-sm">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-chm-md bg-cta-soft text-body-lg font-bold text-cta">✓</span>
              <div>
                <div className="text-body-sm font-bold text-ink-850">표준 단가 · 책임 시공</div>
                <div className="text-caption text-ink-500">견적부터 사후 점검까지 투명하게</div>
              </div>
            </div>
          </div>
        }
      />

      {/* ── 통계 밴드 ── */}
      <StatBand
        title={"낡아가는 동네,\n수리는 미뤄지고 있습니다"}
        description="대전 저층 주거지 조사 결과, 작은 수리조차 맡길 곳이 없어 안전 문제로 이어지고 있습니다."
        stats={[
          { value: '79,884', unit: '동', label: '대전 노후 저층주택 수', accent: 'selfreliance' },
          { value: '66.7', unit: '%', label: '노후주택 비율(증가 추세)', accent: 'community' },
          { value: '48.8', unit: '%', label: '경수리에 어려움을 겪는 주민', accent: 'trust' },
        ]}
      />

      {/* ── 서비스 3종 ── */}
      <section className="bg-surface-warm">
        <Container size="xl" className="py-20">
          <div className="mb-11 text-center">
            <div className="mb-2.5 font-display text-caption font-bold uppercase tracking-[0.14em] text-cta">Our Services</div>
            <h2 className="text-h2 font-bold tracking-tight text-ink-850">무엇을 하나요</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {SERVICES.map((s) => (
              <Link
                key={s.no}
                href="/business"
                className="group flex flex-col rounded-chm-lg border border-border bg-surface p-8 transition-all hover:-translate-y-1 hover:shadow-chm-lg"
              >
                <span className={`mb-4 grid h-11 w-11 place-items-center rounded-chm-md bg-${s.value}-50 font-display text-body-lg font-bold text-${s.value}-600`}>{s.no}</span>
                <h3 className="mb-2.5 text-h4 font-bold text-ink-850">{s.title}</h3>
                <p className="mb-4 flex-1 text-body-sm leading-normal text-ink-600">{s.desc}</p>
                <span className={`text-body-sm font-bold text-${s.value}-600`}>자세히 보기 →</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 이용 절차 ── */}
      <section className="bg-surface">
        <Container size="xl" className="grid gap-14 py-20 md:grid-cols-[0.9fr_1.6fr]">
          <div>
            <div className="mb-2.5 font-display text-caption font-bold uppercase tracking-[0.14em] text-primary">How it works</div>
            <h2 className="mb-3.5 text-h2 font-bold tracking-tight text-ink-850">신청부터 점검까지,<br />이렇게 진행됩니다</h2>
            <p className="text-body leading-normal text-ink-600">일회성 수리로 끝내지 않습니다. 수리 후에도 정기 점검으로 우리 집 상태를 계속 관리합니다.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {STEPS.map((s) => (
              <div key={s.n} className="flex items-start gap-4 rounded-chm-lg border border-border p-6">
                <span className={`grid h-9 w-9 flex-none place-items-center rounded-full bg-${s.value}-500 text-body-sm font-bold text-white`}>{s.n}</span>
                <div>
                  <div className="mb-1.5 text-body-lg font-bold text-ink-850">{s.title}</div>
                  <div className="text-body-sm leading-normal text-ink-600">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 핵심가치 스트립 ── */}
      <section className="border-y border-border bg-surface-warm">
        <Container size="xl" className="flex flex-wrap items-center justify-between gap-6 py-10">
          <div className="text-body-lg font-bold text-ink-850">CHM Group의 6가지 핵심가치</div>
          <ValueDotStrip variant="dots" showLabels />
          <Link href="/about" className="text-body-sm font-bold text-primary hover:underline">가치 이야기 →</Link>
        </Container>
      </section>

      {/* ── 최근 소식 ── */}
      <section className="bg-surface">
        <Container size="xl" className="py-20">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-h2 font-bold tracking-tight text-ink-850">소식</h2>
            <Link href="/news" className="text-body-sm font-bold text-primary hover:underline">전체 보기 →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {recentPosts.map((n) => {
              const cat = POST_CATEGORY[n.category] || { label: n.category, value: 'trust' };
              return (
                <Link
                  key={n.id}
                  href={`/news/${n.id}`}
                  className="block rounded-chm-lg border border-border p-6 transition-all hover:border-ink-300 hover:shadow-chm-md"
                >
                  <span className={`mb-3.5 inline-block rounded-chm-full bg-${cat.value}-500 px-2.5 py-1 text-caption font-bold text-white`}>{cat.label}</span>
                  <div className="mb-3 text-body-lg font-bold leading-snug text-ink-850">{n.title}</div>
                  <div className="text-caption text-ink-500">{fmtDate(n.createdAt)}</div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── CTA 배너 ── */}
      <section className="bg-selfreliance-600">
        <Container size="xl" className="flex flex-wrap items-center justify-between gap-8 py-16">
          <div>
            <h2 className="mb-2.5 text-h2 font-bold tracking-tight text-white">집 고칠 일이 있으신가요?</h2>
            <p className="text-body-lg text-white/90">작은 수리도 괜찮습니다. 신청을 남겨주시면 하루 안에 연락드립니다.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/apply"
              className="inline-flex h-12 items-center rounded-chm-lg bg-white px-6 text-body-lg font-bold text-selfreliance-700 transition-colors hover:bg-selfreliance-50"
            >
              집수리 신청
            </Link>
            <a
              href={c.phoneHref}
              className="inline-flex h-12 items-center rounded-chm-lg border-[1.5px] border-white/60 px-6 text-body-lg font-bold text-white transition-colors hover:bg-white/10"
            >
              전화 문의 {c.phone}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
