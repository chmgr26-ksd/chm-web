import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Progress — 진행률 바.
 * @param {number} value  0–100
 * @param {'trust'|'selfreliance'|'cooperation'|'community'|'innovation'|'sustainability'} [value_ 'trust']
 * @param {boolean} [showLabel]
 */
const FILL = {
  trust: 'bg-trust-500', selfreliance: 'bg-selfreliance-500', cooperation: 'bg-cooperation-500',
  community: 'bg-community-500', innovation: 'bg-innovation-500', sustainability: 'bg-sustainability-500',
};

export function Progress({ value = 0, tone = 'trust', size = 'md', showLabel = false, className, ...props }) {
  const pct = Math.max(0, Math.min(100, value));
  const h = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }[size];
  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      <div className={cn('flex-1 overflow-hidden rounded-chm-full bg-ink-100', h)} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={cn('h-full rounded-chm-full transition-[width] duration-slow ease-chm', FILL[tone])} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="w-10 text-right text-caption font-semibold tabular-nums text-ink-600">{Math.round(pct)}%</span>}
    </div>
  );
}

export default Progress;
