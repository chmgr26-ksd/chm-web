import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Timeline / TimelineItem — 연혁·비전 로드맵 (기획서: 연혁·비전·미션 페이지).
 *
 *   <Timeline>
 *     <TimelineItem year="2030" title="중기 비전" value="trust">…</TimelineItem>
 *   </Timeline>
 */
export function Timeline({ className, children, ...props }) {
  return <ol className={cn('relative flex flex-col gap-6 pl-6', className)} {...props}>{children}</ol>;
}

const DOT = {
  trust: 'bg-trust-500', selfreliance: 'bg-selfreliance-500', cooperation: 'bg-cooperation-500',
  community: 'bg-community-500', innovation: 'bg-innovation-500', sustainability: 'bg-sustainability-500',
};

export function TimelineItem({ year, title, value = 'trust', last = false, className, children, ...props }) {
  return (
    <li className={cn('relative', className)} {...props}>
      {!last && <span className="absolute -left-[18px] top-3 h-full w-px bg-border" aria-hidden />}
      <span className={cn('absolute -left-[22px] top-1.5 h-3 w-3 rounded-full ring-4 ring-surface', DOT[value])} aria-hidden />
      <div className="flex flex-wrap items-baseline gap-x-3">
        {year && <span className={cn('text-body-sm font-bold tabular-nums', DOT[value].replace('bg-', 'text-'))}>{year}</span>}
        <h3 className="text-h4 font-semibold text-ink-800">{title}</h3>
      </div>
      {children && <div className="mt-1.5 text-body-sm leading-relaxed text-ink-600">{children}</div>}
    </li>
  );
}

export default Timeline;
