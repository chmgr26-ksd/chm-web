import React, { useState } from 'react';
import { cn } from '../lib/cn.js';

/**
 * NoticeBar — 페이지 최상단 공지/모집 알림 바.
 * 공식 웹 핸드오프의 "2026 집수리 교실 모집 중" 바를 컴포넌트화한 것.
 *
 * @param {string} [badge]        좌측 알약 배지 문구 (예: "모집")
 * @param {React.ReactNode} children  공지 본문
 * @param {{label:string, href?:string, onClick?:Function}} [action]  우측 링크(예: "자세히 보기 →")
 * @param {'dark'|'cta'|'primary'} [tone='dark']  바 배경 톤
 * @param {boolean} [dismissible=false]  닫기(X) 버튼 표시
 * @param {Function} [onDismiss]   닫힐 때 콜백
 */
const TONE = {
  dark:    { bar: 'bg-surface-dark text-ink-200',       badge: 'bg-cta text-white',            link: 'text-community-400' },
  cta:     { bar: 'bg-cta text-white',                  badge: 'bg-white text-cta',            link: 'text-white underline' },
  primary: { bar: 'bg-primary text-white',              badge: 'bg-white text-primary',        link: 'text-community-200' },
};

export function NoticeBar({
  badge,
  children,
  action,
  tone = 'dark',
  dismissible = false,
  onDismiss,
  className,
  ...props
}) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const t = TONE[tone] || TONE.dark;

  const close = () => {
    setOpen(false);
    onDismiss?.();
  };

  return (
    <div
      role="region"
      aria-label="공지"
      className={cn(
        'relative flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 px-5 py-2.5 text-center text-body-sm',
        t.bar,
        className
      )}
      {...props}
    >
      {badge && (
        <span className={cn('rounded-chm-full px-2 py-0.5 text-overline font-bold tracking-wide', t.badge)}>
          {badge}
        </span>
      )}
      <span className="font-medium">{children}</span>
      {action && (
        <a
          href={action.href}
          onClick={action.onClick}
          className={cn('cursor-pointer font-bold hover:opacity-80', t.link)}
        >
          {action.label}
        </a>
      )}
      {dismissible && (
        <button
          type="button"
          onClick={close}
          aria-label="공지 닫기"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-chm-sm p-1 opacity-70 hover:opacity-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default NoticeBar;
