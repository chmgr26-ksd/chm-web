import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * ValueDotStrip — 6대 핵심가치를 6색으로 나열하는 브랜드 시그니처 스트립.
 * 로고 육각형의 6색을 그대로 옮긴 모티프로, 히어로·핵심가치 섹션·푸터 등에서 반복 사용.
 *
 * @param {'dots'|'pills'|'bar'} [variant='dots']  표시 형태
 *   - dots: 색 점(+선택적 라벨)  - pills: 라벨 알약  - bar: 연속 색 바
 * @param {boolean} [showLabels=false]  dots에서 가치명 표시
 * @param {'sm'|'md'} [size='md']
 * @param {Array} [values]  표시 순서(기본: 성장 시퀀스 6가치)
 * @param {string} [className]
 */
// 성장 시퀀스: 자립 → 신뢰 → 상생 → 공동체 → 혁신 → 지속가능성
const CORE = [
  { key: 'selfreliance',   label: '자립',       dot: 'bg-selfreliance-500' },
  { key: 'trust',          label: '신뢰',       dot: 'bg-trust-500' },
  { key: 'cooperation',    label: '상생',       dot: 'bg-cooperation-500' },
  { key: 'community',      label: '공동체',     dot: 'bg-community-500' },
  { key: 'innovation',     label: '혁신',       dot: 'bg-innovation-500' },
  { key: 'sustainability', label: '지속가능성', dot: 'bg-sustainability-500' },
];
const CHIP = {
  selfreliance:   'bg-selfreliance-50 text-selfreliance-700',
  trust:          'bg-trust-50 text-trust-700',
  cooperation:    'bg-cooperation-50 text-cooperation-700',
  community:      'bg-community-50 text-community-700',
  innovation:     'bg-innovation-50 text-innovation-700',
  sustainability: 'bg-sustainability-50 text-sustainability-700',
};

export function ValueDotStrip({
  variant = 'dots',
  showLabels = false,
  size = 'md',
  values = CORE,
  className,
  ...props
}) {
  const items = values.map((v) => (typeof v === 'string' ? CORE.find((c) => c.key === v) : v)).filter(Boolean);

  if (variant === 'bar') {
    const h = size === 'sm' ? 'h-1.5' : 'h-2';
    return (
      <span
        role="img"
        aria-label="CHM 6대 핵심가치"
        className={cn('inline-flex overflow-hidden rounded-chm-full', h, className)}
        {...props}
      >
        {items.map((it) => (
          <span key={it.key} className={cn('w-6', it.dot)} />
        ))}
      </span>
    );
  }

  if (variant === 'pills') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)} {...props}>
        {items.map((it) => (
          <span
            key={it.key}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-chm-full font-semibold',
              size === 'sm' ? 'px-2.5 py-1 text-caption' : 'px-3 py-1.5 text-body-sm',
              CHIP[it.key]
            )}
          >
            <span className={cn('h-2 w-2 rounded-full', it.dot)} />
            {it.label}
          </span>
        ))}
      </div>
    );
  }

  // dots
  const dotSize = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';
  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-2', className)} {...props}>
      {items.map((it) => (
        <span key={it.key} className="inline-flex items-center gap-1.5">
          <span className={cn('rounded-full', dotSize, it.dot)} />
          {showLabels && (
            <span className={cn('font-medium text-ink-700', size === 'sm' ? 'text-caption' : 'text-body-sm')}>
              {it.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export default ValueDotStrip;
