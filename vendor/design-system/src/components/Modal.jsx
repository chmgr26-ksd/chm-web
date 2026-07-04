import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Modal — 오버레이 다이얼로그. ESC/백드롭 클릭으로 닫힙니다.
 * @param {boolean} open
 * @param {function} onClose
 * @param {React.ReactNode} [title]
 * @param {'sm'|'md'|'lg'} [size='md']
 * @param {React.ReactNode} [footer]
 */
const SIZE = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

export function Modal({ open, onClose, title, size = 'md', footer, className, children, ...props }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px] animate-[chm-fade_.2s_ease]" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={cn('relative w-full rounded-chm-xl bg-surface shadow-chm-xl animate-[chm-pop_.2s_cubic-bezier(0.16,1,0.3,1)]', SIZE[size], className)}
        {...props}
      >
        {title && (
          <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
            <h2 className="text-h4 font-semibold text-ink-800">{title}</h2>
            <button type="button" onClick={onClose} aria-label="닫기" className="text-ink-500 hover:text-ink-800">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>
        )}
        <div className="px-6 py-5 text-body text-ink-700">{children}</div>
        {footer && <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
