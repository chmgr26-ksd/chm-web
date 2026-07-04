import React from 'react';
import { cn } from '../lib/cn.js';
import { Button } from './Button.jsx';

/**
 * DonationCard — 후원·기부 위젯 (기획서: 온라인 후원·결제 기능).
 * 금액 프리셋 선택 + 후원하기 CTA. 상생/공동체 톤을 기본으로 씁니다.
 *
 * @param {number[]} [presets=[10000,30000,50000,100000]]
 * @param {number} [value]  선택 금액(controlled)
 * @param {function} [onSelect]
 * @param {function} [onDonate]
 */
export function DonationCard({
  title = '함께 만드는 따뜻한 마을',
  description = '여러분의 후원은 주민의 자립과 지역 공동체 회복에 쓰입니다.',
  presets = [10000, 30000, 50000, 100000],
  value,
  onSelect,
  onDonate,
  className,
  ...props
}) {
  const [internal, setInternal] = React.useState(presets[1]);
  const selected = value !== undefined ? value : internal;
  const pick = (v) => { if (value === undefined) setInternal(v); onSelect?.(v); };
  const fmt = (n) => n.toLocaleString('ko-KR');

  return (
    <div className={cn('overflow-hidden rounded-chm-xl border border-border bg-surface shadow-chm-md', className)} {...props}>
      <div className="bg-cooperation-500 px-6 py-5 text-white">
        <div className="text-overline font-bold uppercase tracking-wide text-white/80">Donation · 상생</div>
        <h3 className="mt-1 text-h4 font-bold">{title}</h3>
      </div>
      <div className="flex flex-col gap-4 p-6">
        <p className="text-body-sm text-ink-600">{description}</p>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => pick(p)}
              aria-pressed={selected === p}
              className={cn(
                'rounded-chm-md border px-3 py-2.5 text-body-sm font-semibold tabular-nums transition-colors',
                selected === p
                  ? 'border-cooperation-500 bg-cooperation-50 text-cooperation-700'
                  : 'border-border text-ink-700 hover:border-cooperation-300 hover:bg-cooperation-50'
              )}
            >
              {fmt(p)}원
            </button>
          ))}
        </div>
        <Button tone="success" size="lg" block onClick={() => onDonate?.(selected)}>
          {fmt(selected)}원 후원하기
        </Button>
        <p className="text-center text-caption text-ink-400">기부금 영수증 발급 가능 · 안전한 결제</p>
      </div>
    </div>
  );
}

export default DonationCard;
