'use client';
import React from 'react';
import { cn } from '../lib/cn.js';

/* 방문자 통계·분석(기획서 기능)용 경량 SVG 차트. 외부 의존성 없음, SSR 안전. */

const TONE = {
  trust: 'var(--chm-trust-500)', selfreliance: 'var(--chm-selfreliance-500)',
  cooperation: 'var(--chm-cooperation-500)', community: 'var(--chm-community-500)',
  innovation: 'var(--chm-innovation-500)', sustainability: 'var(--chm-sustainability-500)',
};

/**
 * BarChart — 세로 막대 차트.
 * @param {{label:string, value:number}[]} data
 * @param {keyof TONE} [tone='trust']
 * @param {number} [height=180]
 */
export function BarChart({ data = [], tone = 'trust', height = 180, className, ...props }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const color = TONE[tone];
  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2" title={`${d.label}: ${d.value}`}>
            <div className="text-caption font-semibold tabular-nums text-ink-500">{d.value}</div>
            <div
              className="w-full rounded-t-chm-sm transition-[height] duration-slow ease-chm"
              style={{ height: `${(d.value / max) * (height - 44)}px`, background: color, minHeight: 4 }}
            />
            <div className="truncate text-caption text-ink-500">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Sparkline — 추세 라인 (KPI 타일 하단 등).
 * @param {number[]} values
 * @param {number} [width=120] [height=36]
 */
export function Sparkline({ values = [], tone = 'trust', width = 120, height = 36, className, ...props }) {
  if (values.length < 2) return null;
  const max = Math.max(...values), min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / span) * (height - 4) - 2;
    return [x, y];
  });
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const color = TONE[tone];
  const gid = React.useId().replace(/:/g, '');
  return (
    <svg width={width} height={height} className={className} aria-hidden {...props}>
      <defs>
        <linearGradient id={`spark-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.24" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.5" fill={color} />
    </svg>
  );
}

export default BarChart;
