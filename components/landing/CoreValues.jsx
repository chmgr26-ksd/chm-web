'use client';

import { motion } from 'motion/react';

// 랜딩 핵심가치 — chm-group-design/src/components/CoreValues.tsx 이식.
// 6색은 브랜드 PDF 지정색(테마와 무관하게 고정).
const VALUES = [
  {
    title: '자립',
    en: 'Self-Reliance',
    color: 'bg-chm-orange',
    textColor: 'text-chm-orange',
    symbol: '도움을 받는 주민에서 지역의 문제를 해결하는 주민으로 성장',
    keywords: ['주민 역량 강화', '기술 습득', '도전 정신', '일자리 창출', '경제적 자립'],
  },
  {
    title: '신뢰',
    en: 'Trust',
    color: 'bg-chm-blue',
    textColor: 'text-chm-blue',
    symbol: '믿고 맡길 수 있는 생활환경 관리 서비스',
    keywords: ['안전', '책임', '전문성', '품질보증', '투명성'],
  },
  {
    title: '상생',
    en: 'Cooperation',
    color: 'bg-chm-green',
    textColor: 'text-chm-green',
    symbol: '함께 성장하는 지역경제 생태계',
    keywords: ['협력', '파트너십', '지역순환경제', '주민과 상인의 동반성장'],
  },
  {
    title: '공동체',
    en: 'Community',
    color: 'bg-chm-yellow',
    textColor: 'text-chm-yellow',
    symbol: '주민이 주민을 돌보는 따뜻한 마을',
    keywords: ['사람과 사람의 연결', '마을 공동체', '돌봄과 나눔', '소속감', '관계 회복'],
  },
  {
    title: '혁신',
    en: 'Innovation',
    color: 'bg-chm-purple',
    textColor: 'text-chm-purple',
    symbol: '기존의 집수리를 넘어 새로운 지역관리 모델을 만드는 힘',
    keywords: ['창의성', '사회혁신', '새로운 해결방식', '미래지향성'],
  },
  {
    title: '지속가능성',
    en: 'Sustainability',
    color: 'bg-chm-deepgreen',
    textColor: 'text-chm-deepgreen',
    symbol: '지역에 뿌리내리고 세대를 이어 성장하는 플랫폼',
    keywords: ['장기 성장', '환경 보전', '순환경제', '미래세대'],
  },
];

export default function CoreValues() {
  return (
    <section id="values" className="scroll-mt-24 bg-chm-bg-alt py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-chm-text md:text-4xl">핵심가치 (Core Values)</h2>
          <p className="text-lg text-chm-text-muted">CHM Group이 추구하는 지역기반 생활환경 관리 플랫폼의 철학입니다.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-chm-border bg-chm-bg p-8 shadow-sm transition-shadow duration-500 hover:shadow-md"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white shadow-sm ${value.color}`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-chm-text">{value.title}</h3>
                  <p className="text-sm font-medium text-chm-text-muted">{value.en}</p>
                </div>
              </div>

              <p className={`mb-4 font-semibold leading-relaxed ${value.textColor}`}>
                &ldquo;{value.symbol}&rdquo;
              </p>
              <div className="flex flex-wrap gap-2">
                {value.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full border border-chm-border bg-chm-bg-alt px-3 py-1 text-xs font-medium text-chm-text-muted"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
