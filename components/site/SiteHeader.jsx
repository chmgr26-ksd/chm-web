'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button, NoticeBar, Container } from '@chm/design-system';
import { NAV } from './constants';

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const close = () => setOpen(false);

  return (
    <>
      <NoticeBar badge="모집" action={{ label: '자세히 보기 →', href: '/news' }}>
        2026 집수리 교실 1기 수강생 모집 중
      </NoticeBar>

      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <Container size="xl" className="flex h-[72px] items-center justify-between gap-6">
          <Link href="/" className="flex flex-none items-center" aria-label="CHM Group 홈" onClick={close}>
            {/* 공식 로고(원본 마스터) */}
            <img src="/logo.png" alt="CHM Group — Community Housing Management" className="block h-[30px] w-auto sm:h-[34px]" />
          </Link>

          {/* 데스크톱 네비 (sm+) */}
          <nav className="hidden items-center gap-2 sm:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-chm-md px-3 py-2 text-body-sm font-semibold transition-colors ${
                  isActive(n.href) ? 'text-cta' : 'text-ink-700 hover:text-cta'
                }`}
              >
                {n.label}
              </Link>
            ))}
            <Button as={Link} href="/apply" tone="cta" size="sm" className="ml-3">집수리 신청</Button>
          </nav>

          {/* 모바일 햄버거 (< sm) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-chm-md text-ink-700 hover:bg-ink-100 sm:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </Container>

        {/* 모바일 메뉴 패널 */}
        {open && (
          <div className="border-t border-border bg-surface sm:hidden">
            <Container size="xl" className="flex flex-col gap-1 py-3">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={close}
                  className={`rounded-chm-md px-3 py-2.5 text-body font-semibold transition-colors ${
                    isActive(n.href) ? 'bg-cta-soft text-cta' : 'text-ink-700 hover:bg-ink-100'
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <Button as={Link} href="/apply" tone="cta" size="md" className="mt-2" onClick={close}>집수리 신청</Button>
            </Container>
          </div>
        )}
      </header>
    </>
  );
}
