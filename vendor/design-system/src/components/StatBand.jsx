import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * StatBand — 다크 배경의 핵심 지표 밴드(랜딩/소개 페이지용).
 * 좌측 헤드라인 + 우측 대형 수치(Montserrat) 나열. 공식 웹 핸드오프의
 * "낡아가는 동네" 통계 섹션을 컴포넌트화한 것.
 *
 * @param {string} [title]        좌측 헤드라인(줄바꿈은 \n)
 * @param {string} [description]  헤드라인 보조 설명
 * @param {Array<{value:React.ReactNode, unit?:string, label:string,
 *   accent?:'trust'|'selfreliance'|'cooperation'|'community'|'innovation'|'sustainability'}>} stats
 * @param {string} [className]
 */
// 다크 배경 대비를 위해 밝은 톤(300/400)으로 매핑
const ACCENT = {
  selfreliance:   'text-selfreliance-400',
  trust:          'text-trust-300',
  cooperation:    'text-cooperation-300',
  community:      'text-community-400',
  innovation:     'text-innovation-300',
  sustainability: 'text-sustainability-300',
};

export function StatBand({ title, description, stats = [], className, ...props }) {
  const cols = (title ? 1 : 0) + stats.length;
  return (
    <section
      className={cn('bg-surface-dark', className)}
      {...props}
    >
      <div
        className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-14"
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`, ['--cols']: cols }}
      >
        {title && (
          <div className="min-w-[16rem]">
            <h2 className="whitespace-pre-line text-h3 font-bold leading-snug text-white">{title}</h2>
            {description && (
              <p className="mt-2.5 text-body-sm leading-normal text-ink-300">{description}</p>
            )}
          </div>
        )}
        {stats.map((s, i) => (
          <div key={i}>
            <div className={cn('font-display text-[2.375rem] font-extrabold leading-none tracking-tight tabular-nums', ACCENT[s.accent] || 'text-white')}>
              {s.value}
              {s.unit && <span className="text-[1.25rem] font-bold">{s.unit}</span>}
            </div>
            <div className="mt-1.5 text-body-sm text-ink-300">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatBand;
