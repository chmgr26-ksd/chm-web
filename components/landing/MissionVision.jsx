'use client';

import { motion } from 'motion/react';
import { Target, Eye, TrendingUp } from 'lucide-react';

// 랜딩 미션·비전 — chm-group-design/src/components/MissionVision.tsx 이식.
const CARDS = [
  {
    Icon: Target,
    title: '미션 (Mission)',
    description: '지역 주민의 기술과 참여로 주거와 생활환경의 문제를 해결하고, 지속가능한 일자리와 공동체를 만듭니다.',
    details: '우리는 주민을 단순한 서비스 수혜자가 아닌 문제 해결의 주체로 성장시키며, 생활기술 교육과 지역 기반 서비스를 통해 안전한 주거환경과 건강한 지역공동체를 만들어 갑니다.',
  },
  {
    Icon: Eye,
    title: '비전 (Vision)',
    description: '지역과 함께 성장하는 생활환경 관리 전문기업',
    details: '저층 주거지 주거관리에서 출발하여 점포관리, 상권활성화, 생활서비스 영역으로 확장함으로써 지역의 삶과 경제를 연결하는 지속가능한 생활환경 관리 플랫폼으로 성장합니다.',
  },
  {
    Icon: TrendingUp,
    title: '중장기 목표',
    description: '2030년 대전광역시 행정동 기반 주거관리 사업단 구축, 2035년 지역혁신 플랫폼으로 도약',
    details: '주거·점포·생활환경을 통합 관리하는 전국 대표 생활환경 관리 모델로 성장하여 지역 기반 양질의 일자리를 창출합니다.',
  },
];

export default function MissionVision() {
  return (
    // scroll-mt: sticky 헤더에 제목이 가려지지 않도록 앵커 이동 시 여백 확보
    <section id="about" className="scroll-mt-24 bg-chm-bg py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-chm-text md:text-4xl">우리의 미션과 비전</h2>
          <p className="text-lg text-chm-text-muted">CHM Group이 만들어가는 더 나은 지역사회의 청사진입니다.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {CARDS.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-chm-border bg-chm-bg-alt p-8 transition-shadow duration-500 hover:shadow-lg"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-chm-border bg-chm-bg shadow-sm">
                <card.Icon className="h-8 w-8 text-chm-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-chm-text">{card.title}</h3>
              <p className="mb-4 text-lg font-semibold leading-relaxed text-chm-text">{card.description}</p>
              <p className="text-sm leading-relaxed text-chm-text-muted">{card.details}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
