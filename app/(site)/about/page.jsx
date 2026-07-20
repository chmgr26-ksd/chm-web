import { Container, StatBand } from '@chm/design-system';
import PageBanner from '../../../components/site/PageBanner';
import { VALUES } from '../../../components/site/constants';
import { getSiteImageVersions, siteImageUrl } from '@/lib/siteContent';

export const metadata = { title: '소개', description: '지역과 함께 성장하는 생활환경 관리 전문기업 CHM Group의 비전과 6대 핵심가치를 소개합니다.' };

// (구 '메인' 페이지에서 이관) 이용 절차 — 신청부터 정기 점검까지.
const STEPS = [
  { n: 1, value: 'selfreliance', title: '신청·문의', desc: '홈페이지나 전화로 필요한 수리를 알려주세요.' },
  { n: 2, value: 'trust', title: '방문 견적', desc: '이웃 기술자가 방문해 표준 단가로 견적을 드립니다.' },
  { n: 3, value: 'cooperation', title: '수리 시공', desc: '약속한 일정에 책임 시공하고 결과를 확인받습니다.' },
  { n: 4, value: 'sustainability', title: '정기 점검', desc: '수리 이후에도 주기적으로 집 상태를 살핍니다.' },
];

const TEAM = [
  { initial: '김', value: 'selfreliance', name: '김수동', role: '대표', desc: '사업 총괄 · BM 수립 — 前 안녕센터 사무국장, 現 LCL사회적협동조합 이사장. 충남대 LINC+ · 리빙랩 사업 참여' },
  { initial: '박', value: 'trust', name: '박민수', role: '팀원', desc: '대외협력 · 홍보 마케팅 — 前 안녕센터 사업팀장, 現 YMCA 이사. 충남대 LINC+ · 리빙랩 사업 참여' },
];

const PARTNERS = [
  { name: '충남대학교 건축과', role: '주거관리 정책개발 · 효과성 검증' },
  { name: '공공감성', role: '고난이도 수리 기술 교육훈련 · 인턴십' },
  { name: '에이제로 스튜디오', role: '주거관리 모델개발 · 컨설팅' },
  { name: '로컬커뮤니티랩 사회적협동조합', role: '마을조사연구 · 마을자치회 교육' },
];

export default async function AboutPage() {
  const versions = await getSiteImageVersions();
  return (
    <>
      <PageBanner
        eyebrow="About us"
        title={<>지역과 함께 성장하는<br />생활환경 관리 전문기업</>}
        description="(주)씨에이치엠그룹은 저층 주거지 집수리에서 출발해 점포관리·에너지·생활서비스로 확장하며, 지역의 삶과 경제를 연결하는 플랫폼을 만들어 갑니다."
      />

      {/* ── 문제 제기 통계 (구 '메인'에서 이관) ── */}
      <StatBand
        title={"낡아가는 동네,\n수리는 미뤄지고 있습니다"}
        description="대전 저층 주거지 조사 결과, 작은 수리조차 맡길 곳이 없어 안전 문제로 이어지고 있습니다."
        stats={[
          { value: '79,884', unit: '동', label: '대전 노후 저층주택 수', accent: 'selfreliance' },
          { value: '66.7', unit: '%', label: '노후주택 비율(증가 추세)', accent: 'community' },
          { value: '48.8', unit: '%', label: '경수리에 어려움을 겪는 주민', accent: 'trust' },
        ]}
      />

      {/* ── 미션 / 비전 ── */}
      <section className="bg-surface">
        <Container size="xl" className="grid gap-6 py-20 md:grid-cols-2">
          <div className="rounded-chm-lg border border-border bg-surface-warm p-9">
            <div className="mb-3.5 font-display text-caption font-bold uppercase tracking-[0.14em] text-cta">Mission</div>
            <p className="mb-3.5 text-h3 font-bold leading-snug text-ink-850">“지역 주민의 기술과 참여로 주거와 생활환경의 문제를 해결하고, 지속가능한 일자리와 공동체를 만든다.”</p>
            <p className="text-body-sm leading-relaxed text-ink-600">주민을 서비스 수혜자가 아닌 문제 해결의 주체로 성장시키며, 생활기술 교육과 지역 기반 서비스로 안전한 주거환경과 건강한 공동체를 만들어 갑니다.</p>
          </div>
          <div className="rounded-chm-lg border border-border bg-surface-warm p-9">
            <div className="mb-3.5 font-display text-caption font-bold uppercase tracking-[0.14em] text-primary">Vision</div>
            <p className="mb-5 text-h3 font-bold leading-snug text-ink-850">“지역과 함께 성장하는 생활환경 관리 전문기업”</p>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-start gap-3.5">
                <span className="flex-none rounded-chm-md bg-trust-50 px-2.5 py-1 font-display text-caption font-bold text-primary">2030</span>
                <span className="text-body-sm leading-normal text-ink-700">대전광역시 행정동 기반 주거관리 사업단 구축 — 주민 기술인력 양성, 회원제 주거관리 정착</span>
              </div>
              <div className="flex items-start gap-3.5">
                <span className="flex-none rounded-chm-md bg-sustainability-50 px-2.5 py-1 font-display text-caption font-bold text-sustainability-600">2035</span>
                <span className="text-body-sm leading-normal text-ink-700">주거·점포·생활환경을 통합 관리하는 지역혁신 플랫폼 — 전국 대표 생활환경 관리 모델로 성장</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 핵심가치 6 ── */}
      <section className="border-t border-border bg-surface-warm">
        <Container size="xl" className="py-20">
          <div className="mb-10 text-center">
            <div className="mb-2.5 font-display text-caption font-bold uppercase tracking-[0.14em] text-cta">Core Values</div>
            <h2 className="text-h2 font-bold tracking-tight text-ink-850">여섯 가지 가치, 하나의 성장 과정</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.key} className="rounded-chm-lg border border-border bg-surface p-7">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className={`h-3.5 w-3.5 rounded-full bg-${v.key}-500`} />
                  <span className="text-h4 font-bold text-ink-850">{v.name}</span>
                  <span className="font-display text-overline font-bold tracking-wide text-ink-500">{v.eng}</span>
                </div>
                <p className="text-body-sm leading-normal text-ink-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 이용 절차 (구 '메인'에서 이관) ── */}
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

      {/* ── 팀 / 협력 네트워크 ── */}
      <section className="bg-surface">
        <Container size="xl" className="grid gap-14 py-20 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-h3 font-bold tracking-tight text-ink-850">함께하는 사람들</h2>
            <div className="flex flex-col gap-4">
              {TEAM.map((m) => (
                <div key={m.name} className="flex items-center gap-4 rounded-chm-lg border border-border p-5">
                  <span className={`grid h-14 w-14 flex-none place-items-center rounded-full bg-${m.value}-50 text-h4 font-bold text-${m.value}-600`}>{m.initial}</span>
                  <div>
                    <div className="text-body-lg font-bold text-ink-850">{m.name}<span className={`ml-1.5 text-body-sm font-bold text-${m.value}-600`}>{m.role}</span></div>
                    <div className="mt-1 text-body-sm leading-snug text-ink-600">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-chm-md border border-trust-100 bg-surface-cool px-5 py-4 text-body-sm leading-normal text-ink-700">
              <strong className="text-primary">로드맵</strong> — 2026년 7월 예비사회적기업 지정 신청 → 2027년 인증 사회적기업 전환 목표
            </div>
          </div>
          <div>
            <h2 className="mb-6 text-h3 font-bold tracking-tight text-ink-850">협력 네트워크</h2>
            <div className="grid gap-3.5 sm:grid-cols-2">
              {PARTNERS.map((p) => (
                <div key={p.name} className="rounded-chm-md border border-border p-5">
                  <div className="mb-1.5 text-body font-bold text-ink-850">{p.name}</div>
                  <div className="text-body-sm leading-snug text-ink-600">{p.role}</div>
                </div>
              ))}
            </div>
            <div className="mt-3.5 overflow-hidden rounded-chm-md border border-border">
              <img
                src={siteImageUrl('about-team', versions)}
                alt="구즉동 집수리교실 수료 단체 사진 — 참가 주민과 함께"
                width={406}
                height={284}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
