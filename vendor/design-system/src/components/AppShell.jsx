import React from 'react';
import { cn } from '../lib/cn.js';
import { Logo } from './Logo.jsx';

/**
 * AppShell — 웹앱/업무 플랫폼 레이아웃 (사이드바 + 상단바 + 본문).
 * 기획서 FORM D의 대시보드·관리자 화면 기반 골격입니다.
 *
 *   <AppShell
 *     sidebar={<Sidebar>…</Sidebar>}
 *     topbar={<Topbar user={…} />}
 *   >
 *     <PageHeader … /> …본문…
 *   </AppShell>
 */
export function AppShell({ sidebar, topbar, className, children, ...props }) {
  return (
    <div className={cn('min-h-screen bg-ink-50 text-ink-800', className)} {...props}>
      {sidebar}
      <div className="lg:pl-64">
        {topbar}
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

/** Sidebar — 좌측 고정 내비게이션 컨테이너. logoHref 지정 시 로고 클릭으로 이동. */
export function Sidebar({ footer, logoHref, className, children, ...props }) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-surface lg:flex',
        className
      )}
      {...props}
    >
      <div className="flex h-16 items-center border-b border-border px-5">
        {logoHref ? (
          <a href={logoHref} aria-label="홈으로" className="inline-flex items-center rounded-chm-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Logo variant="full" size={26} />
          </a>
        ) : (
          <Logo variant="full" size={26} />
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-3">{children}</nav>
      {footer && <div className="border-t border-border p-3">{footer}</div>}
    </aside>
  );
}

/** SidebarSection — 그룹 라벨. */
export function SidebarSection({ label, className, children, ...props }) {
  return (
    <div className={cn('mb-1 mt-4 first:mt-0', className)} {...props}>
      {label && <div className="px-3 pb-1 text-overline font-bold uppercase tracking-wide text-ink-400">{label}</div>}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

/** SidebarItem — 내비게이션 항목. */
export function SidebarItem({ active = false, icon, badge, className, children, ...props }) {
  return (
    <a
      className={cn(
        'flex items-center gap-3 rounded-chm-md px-3 py-2 text-body-sm font-semibold transition-colors',
        active ? 'bg-trust-50 text-trust-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-800',
        className
      )}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {icon && <span className={cn('flex-shrink-0', active ? 'text-trust-600' : 'text-ink-400')}>{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {badge != null && (
        <span className="rounded-chm-full bg-ink-100 px-2 py-0.5 text-overline font-bold text-ink-600">{badge}</span>
      )}
    </a>
  );
}

/** Topbar — 상단 바 (검색/알림/사용자). */
export function Topbar({ title, actions, className, children, ...props }) {
  return (
    <header
      className={cn('sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6 lg:px-8', className)}
      {...props}
    >
      {title && <div className="text-h4 font-semibold text-ink-800">{title}</div>}
      <div className="flex-1">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

export default AppShell;
