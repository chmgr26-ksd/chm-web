import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * ValueCard — CHM Group 6대 핵심가치 전용 카드.
 * 각 가치의 브랜드 컬러·의미·상징 문구를 브랜드 정체성에 맞게 표현합니다.
 *
 * @param {'trust'|'selfreliance'|'cooperation'|'community'|'innovation'|'sustainability'} value
 * @param {string} label     예: "신뢰"
 * @param {string} labelEn   예: "Trust"
 * @param {string} symbol    상징 문구
 * @param {string[]} [meanings]  의미 키워드
 * @param {React.ReactNode} [icon]
 */
const THEME = {
  trust:          { bar: 'bg-trust-500', chip: 'bg-trust-50 text-trust-700', ring: 'ring-trust-100', hex: 'text-trust-500' },
  selfreliance:   { bar: 'bg-selfreliance-500', chip: 'bg-selfreliance-50 text-selfreliance-700', ring: 'ring-selfreliance-100', hex: 'text-selfreliance-500' },
  cooperation:    { bar: 'bg-cooperation-500', chip: 'bg-cooperation-50 text-cooperation-700', ring: 'ring-cooperation-100', hex: 'text-cooperation-500' },
  community:      { bar: 'bg-community-500', chip: 'bg-community-50 text-community-700', ring: 'ring-community-100', hex: 'text-community-500' },
  innovation:     { bar: 'bg-innovation-500', chip: 'bg-innovation-50 text-innovation-700', ring: 'ring-innovation-100', hex: 'text-innovation-500' },
  sustainability: { bar: 'bg-sustainability-500', chip: 'bg-sustainability-50 text-sustainability-700', ring: 'ring-sustainability-100', hex: 'text-sustainability-500' },
};

export function ValueCard({ value, label, labelEn, symbol, meanings = [], icon, className, ...props }) {
  const t = THEME[value];
  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-chm-lg bg-surface p-6 shadow-chm-sm',
        'ring-1 ring-inset transition-all duration-chm ease-chm hover:shadow-chm-lg',
        t.ring,
        className
      )}
      {...props}
    >
      <span className={cn('absolute left-0 top-0 h-full w-1.5 rounded-l-chm-lg', t.bar)} />
      <div className="flex items-center gap-3">
        <span className={cn('grid h-11 w-11 place-items-center rounded-chm-md', t.chip)}>
          {icon || (
            <svg viewBox="0 0 24 24" width="22" height="22" className={t.hex} fill="currentColor" aria-hidden>
              <path d="M12 2l8.66 5v10L12 22l-8.66-5V7z" opacity="0.9" />
            </svg>
          )}
        </span>
        <div>
          <div className="text-h4 font-bold text-ink-800">{label}</div>
          <div className="text-caption font-semibold uppercase tracking-wide text-ink-500">{labelEn}</div>
        </div>
      </div>
      {symbol && <p className="mt-4 text-body-sm leading-relaxed text-ink-700">“{symbol}”</p>}
      {meanings.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {meanings.map((m) => (
            <span key={m} className={cn('rounded-chm-full px-2.5 py-1 text-caption font-medium', t.chip)}>{m}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default ValueCard;
