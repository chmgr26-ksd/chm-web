import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * EmptyState — 빈 목록/무결과 안내.
 * @param {React.ReactNode} [icon]
 * @param {string} title
 * @param {string} [description]
 * @param {React.ReactNode} [action]
 */
export function EmptyState({ icon, title, description, action, className, ...props }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 rounded-chm-lg border border-dashed border-border bg-surface px-6 py-12 text-center', className)} {...props}>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-ink-100 text-ink-400" aria-hidden>
        {icon || (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        )}
      </span>
      <div>
        <div className="text-body font-semibold text-ink-800">{title}</div>
        {description && <p className="mx-auto mt-1 max-w-sm text-body-sm text-ink-500">{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export default EmptyState;
