import Link from 'next/link';
import { Container, Button } from '@chm/design-system';
import PageBanner from '../../../components/site/PageBanner';
import { getSiteImageVersions, siteImageUrl } from '@/lib/siteContent';

export const metadata = { title: '사업 안내', description: '집수리 서비스·집수리 교실·마을관리사업단 — CHM Group의 사업 영역과 성장 단계를 소개합니다.' };

const TAGS = ['방충망·창호', '수전·누수', '조명·전기', '문·손잡이', '곰팡이·단열', '안전 점검'];

const GUARANTEE = [
  { value: 'selfreliance', title: '표준 단가', desc: '가격 기준을 공개해 불신을 없앱니다' },
  { value: 'trust', title: '품질 보증', desc: '시공 결과를 조직이 함께 책임집니다' },
  { value: 'sustainability', title: '상시 관리', desc: '일회성이 아닌 정기 점검으로 이어집니다' },
];

const STEPS = [
  { step: 'STEP 1', value: 'trust', title: '교육', desc: '기초 수리 기술과 안전 교육. 공구 사용법부터 자재 이해까지 체계적으로 배웁니다.' },
  { step: 'STEP 2', value: 'cooperation', title: '실습', desc: '실제 주택에서 멘토 기술자와 함께 실습하며 현장 감각을 익힙니다.' },
  { step: 'STEP 3', value: 'selfreliance', title: '현장 투입', desc: '사업단 소속으로 유급 활동을 시작합니다. 도움을 받던 주민에서 문제를 해결하는 주민으로.' },
];

const PHASES = [
  { phase: 'PHASE 01', value: 'selfreliance', title: '주거관리', desc: '저층 주거지 집수리로 기반 구축, 주민 신뢰 확보' },
  { phase: 'PHASE 02', value: 'trust', title: '점포관리', desc: '골목상권 점포 시설관리로 서비스 영역 확장' },
  { phase: 'PHASE 03', value: 'cooperation', title: '에너지 전환', desc: '친환경 에너지 설비·단열 개선 사업 진출' },
  { phase: 'PHASE 04', value: 'sustainability', title: '로컬커뮤니티', desc: '지역 기반 통합 관리 플랫폼으로 공동체 구축' },
];

export default async function BusinessPage() {
  const versions = await getSiteImageVersions();
  return (
    <>
      <PageBanner
        eyebrow="Business"
        title={<>단순 수리가 아닌,<br />시스템을 만듭니다</>}
        description="교육 → 인력 → 사업단 → 서비스 → 수익 → 재투자로 이어지는 지속가능한 지역관리 구조를 운영합니다."
      />

      {/* ── 집수리 서비스 ── */}
      <section className="bg-surface">
        <Container size="xl" className="py-20">
          <h2 className="mb-8 text-h2 font-bold tracking-tight text-ink-850">집수리 서비스</h2>
          <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <div>
              <p className="mb-5 text-body-lg leading-relaxed text-ink-600">플랫폼처럼 연결만 하고 끝나지 않습니다. 교육을 이수한 주민 기술자가 표준 단가로 시공하고, CHM Group이 품질과 책임을 보증합니다.</p>
              <div className="mb-6 flex flex-wrap gap-2.5">
                {TAGS.map((t) => (
                  <span key={t} className="rounded-chm-full border border-border bg-surface-warm px-4 py-2 text-body-sm font-medium text-ink-700">{t}</span>
                ))}
              </div>
              <div className="grid gap-3.5 sm:grid-cols-3">
                {GUARANTEE.map((g) => (
                  <div key={g.title} className={`rounded-chm-md bg-${g.value}-50 p-5`}>
                    <div className={`mb-1 text-body font-bold text-${g.value}-700`}>{g.title}</div>
                    <div className={`text-caption leading-normal text-${g.value}-600`}>{g.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-chm-lg border border-border">
              <img
                src={siteImageUrl('business-field', versions)}
                alt="집수리교실 현장 — 화장실 타일 시공 실습"
                width={274}
                height={274}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── 집수리 교실 ── */}
      <section className="border-t border-border bg-surface-warm">
        <Container size="xl" className="py-20">
          <h2 className="mb-3 text-h2 font-bold tracking-tight text-ink-850">집수리 교실</h2>
          <p className="mb-8 max-w-2xl text-body-lg leading-normal text-ink-600">주민을 전문 수리 인력으로 키우는 교육 프로그램입니다. 수료 후에는 마을관리사업단에 합류해 실제 현장에서 일할 수 있습니다.</p>
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="rounded-chm-lg border border-border bg-surface p-7">
                <div className={`mb-2.5 font-display text-caption font-bold tracking-wide text-${s.value}-600`}>{s.step}</div>
                <div className="mb-2 text-h4 font-bold text-ink-850">{s.title}</div>
                <p className="text-body-sm leading-normal text-ink-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 성장 로드맵 ── */}
      <section className="bg-surface">
        <Container size="xl" className="py-20">
          <h2 className="mb-3 text-h2 font-bold tracking-tight text-ink-850">성장 로드맵</h2>
          <p className="mb-8 max-w-2xl text-body-lg leading-normal text-ink-600">공공으로 시작해 민간으로, 주거에서 마을 전체로 확장합니다.</p>
          <div className="grid gap-5 md:grid-cols-4">
            {PHASES.map((p) => (
              <div key={p.phase} className="overflow-hidden rounded-chm-lg border border-border bg-surface">
                <div className={`h-1.5 bg-${p.value}-500`} />
                <div className="p-6">
                  <div className={`mb-2.5 font-display text-caption font-bold tracking-wide text-${p.value}-600`}>{p.phase}</div>
                  <div className="mb-2 text-h4 font-bold text-ink-850">{p.title}</div>
                  <p className="text-body-sm leading-normal text-ink-600">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-4 rounded-chm-lg bg-surface-warm p-8">
            <div className="flex-1">
              <div className="text-h4 font-bold text-ink-850">우리 동네 집수리, 지금 신청하세요</div>
              <div className="mt-1 text-body-sm text-ink-600">작은 수리도 괜찮습니다. 접수 후 영업일 기준 1일 내에 연락드립니다.</div>
            </div>
            <Button as={Link} href="/apply" tone="cta" size="lg">집수리 신청</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
