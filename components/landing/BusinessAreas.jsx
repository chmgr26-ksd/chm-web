'use client';

import { motion } from 'motion/react';
import { Wrench, Store, Leaf, Users } from 'lucide-react';

// 랜딩 사업분야 — chm-group-design/src/components/BusinessAreas.tsx 이식.
const AREAS = [
  {
    Icon: Wrench,
    title: '주거관리',
    description: '저층 주거지 집수리 서비스로 기반을 구축하고 주민의 신뢰를 확보합니다.',
    items: ['주택 수리 인력 양성', '상시 관리 서비스', '취약계층 주거환경 개선'],
  },
  {
    Icon: Store,
    title: '점포관리',
    description: '골목상권 점포 시설관리로 서비스 영역을 확장합니다.',
    items: ['점포 시설 보수', '상권 환경 개선', '정기 유지보수'],
  },
  {
    Icon: Leaf,
    title: '에너지 전환',
    description: '친환경 에너지 설비 및 단열 개선 사업으로 진출합니다.',
    items: ['에너지 효율 개선', '친환경 설비 시공', '단열 및 창호 교체'],
  },
  {
    Icon: Users,
    title: '로컬커뮤니티',
    description: '지역 기반 통합 관리 플랫폼으로 공동체를 구축합니다.',
    items: ['마을관리 사업단', '주민조직 및 자조모임', '마을축제 지원'],
  },
];

const STRATEGY = [
  { n: 1, title: '주민 기술 인력 양성:', desc: '지역 주민을 전문 수리 인력으로 양성하여 일자리 창출과 인프라 구축' },
  { n: 2, title: '행정동 단위 사업단 구축:', desc: '지역 밀착형 서비스 체계로 상호 돌봄과 신뢰 확보' },
  { n: 3, title: '상시 관리 서비스 운영:', desc: '일회성이 아닌 지속적인 주거 환경 개선 시스템 구축' },
];

export default function BusinessAreas() {
  return (
    <section id="business" className="scroll-mt-24 bg-chm-bg py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center gap-12 md:flex-row">
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-6 text-3xl font-bold text-chm-text md:text-4xl">문제 해결 전략 및 사업 구조</h2>
              <p className="mb-6 text-lg leading-relaxed text-chm-text-muted">
                노후주택 증가와 수리 어려움이라는 지역 사회의 문제를 해결하기 위해, CHM Group은{' '}
                <strong className="text-chm-primary">교육 → 인력 양성 → 사업단 조직 → 상시 서비스</strong>로 이어지는 선순환 구조를 만듭니다.
              </p>
              <ul className="space-y-4">
                {STRATEGY.map((s) => (
                  <li key={s.n} className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-chm-primary/10 text-chm-primary">
                      {s.n}
                    </div>
                    <p className="text-chm-text-muted">
                      <strong className="text-chm-text">{s.title}</strong> {s.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:w-1/2">
            {AREAS.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-chm-border bg-chm-bg-alt p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-chm-bg text-chm-primary shadow-sm">
                  <area.Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-chm-text">{area.title}</h3>
                <p className="mb-4 text-sm text-chm-text-muted">{area.description}</p>
                <ul className="space-y-2">
                  {area.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-chm-text-muted">
                      <div className="h-1 w-1 shrink-0 rounded-full bg-chm-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
