import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Pagination — 페이지 네비게이션.
 * @param {number} page  현재(1-base)
 * @param {number} total 총 페이지 수
 * @param {function} onChange
 */
function range(page, total) {
  const out = new Set([1, total, page, page - 1, page + 1]);
  const arr = [...out].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const res = [];
  let prev = 0;
  for (const n of arr) {
    if (n - prev > 1) res.push('…');
    res.push(n);
    prev = n;
  }
  return res;
}

export function Pagination({ page = 1, total = 1, onChange, className, ...props }) {
  const items = range(page, total);
  const base = 'grid h-9 min-w-9 place-items-center rounded-chm-md px-2 text-body-sm font-semibold transition-colors';
  return (
    <nav aria-label="페이지 네비게이션" className={cn('flex items-center gap-1', className)} {...props}>
      <button type="button" disabled={page <= 1} onClick={() => onChange?.(page - 1)} className={cn(base, 'text-ink-600 hover:bg-ink-100 disabled:opacity-40 disabled:pointer-events-none')} aria-label="이전">‹</button>
      {items.map((it, i) =>
        it === '…' ? (
          <span key={`e${i}`} className="grid h-9 w-9 place-items-center text-ink-400">…</span>
        ) : (
          <button
            key={it}
            type="button"
            onClick={() => onChange?.(it)}
            aria-current={it === page ? 'page' : undefined}
            className={cn(base, it === page ? 'bg-trust-500 text-white' : 'text-ink-600 hover:bg-ink-100')}
          >
            {it}
          </button>
        )
      )}
      <button type="button" disabled={page >= total} onClick={() => onChange?.(page + 1)} className={cn(base, 'text-ink-600 hover:bg-ink-100 disabled:opacity-40 disabled:pointer-events-none')} aria-label="다음">›</button>
    </nav>
  );
}

export default Pagination;
