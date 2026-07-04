import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Stat — 핵심 지표 표시 (KPI 타일).
 * @param {string} label
 * @param {React.ReactNode} value
 * @param {string} [unit]
 * @param {{dir:'up'|'down', text:string}} [trend]
 * @param {'trust'|'selfreliance'|'cooperation'|'community'|'innovation'|'sustainability'} [accent]
 */
const ACCENT = {
  trust: 'text-trust-600', selfreliance: 'text-selfreliance-600', cooperation: 'text-cooperation-600',
  community: 'text-community-700', innovation: 'text-innovation-600', sustainability: 'text-sustainability-600',
};

export function Stat({ label, value, unit, trend, accent, icon, className, ...props }) {
  return (
    <div className={cn('rounded-chm-lg border border-border bg-surface p-5', className)} {...props}>
      <div className="flex items-center justify-between">
        <span className="text-caption font-semibold uppercase tracking-wide text-ink-500">{label}</span>
        {icon && <span className={cn(accent && ACCENT[accent], 'text-ink-400')}>{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={cn('text-h1 font-bold tabular-nums', accent ? ACCENT[accent] : 'text-ink-800')}>{value}</span>
        {unit && <span className="text-body-sm font-medium text-ink-500">{unit}</span>}
      </div>
      {trend && (
        <div className={cn('mt-1 inline-flex items-center gap-1 text-caption font-semibold', trend.dir === 'up' ? 'text-cooperation-600' : 'text-danger')}>
          <span aria-hidden>{trend.dir === 'up' ? '▲' : '▼'}</span>
          {trend.text}
        </div>
      )}
    </div>
  );
}

export default Stat;
