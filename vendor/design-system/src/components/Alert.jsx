import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Alert — 인라인 피드백/공지 메시지.
 * @param {'info'|'success'|'warning'|'danger'} [tone='info']
 * @param {React.ReactNode} [title]
 * @param {function} [onClose]
 */
const TONE = {
  info: { box: 'bg-trust-50 border-trust-200', icon: 'text-trust-600', title: 'text-trust-800', mark: 'ⓘ' },
  success: { box: 'bg-cooperation-50 border-cooperation-200', icon: 'text-cooperation-600', title: 'text-cooperation-800', mark: '✓' },
  warning: { box: 'bg-selfreliance-50 border-selfreliance-200', icon: 'text-selfreliance-600', title: 'text-selfreliance-800', mark: '!' },
  danger: { box: 'bg-danger-soft border-danger', icon: 'text-danger', title: 'text-danger', mark: '!' },
};

export function Alert({ tone = 'info', title, onClose, className, children, ...props }) {
  const t = TONE[tone];
  return (
    <div role="alert" className={cn('flex gap-3 rounded-chm-md border p-4', t.box, className)} {...props}>
      <span className={cn('grid h-5 w-5 flex-shrink-0 place-items-center rounded-full font-bold text-body-sm', t.icon)} aria-hidden>
        {t.mark}
      </span>
      <div className="flex-1 min-w-0">
        {title && <div className={cn('text-body-sm font-semibold', t.title)}>{title}</div>}
        {children && <div className={cn('text-body-sm text-ink-700', title && 'mt-0.5')}>{children}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="닫기" className="flex-shrink-0 text-ink-500 hover:text-ink-800">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      )}
    </div>
  );
}

export default Alert;
