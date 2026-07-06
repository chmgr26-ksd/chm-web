'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, NoticeBar, Container } from '@chm/design-system';
import { NAV } from './constants';

export default function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <NoticeBar badge="모집" action={{ label: '자세히 보기 →', href: '/news' }}>
        2026 집수리 교실 1기 수강생 모집 중
      </NoticeBar>

      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <Container size="xl" className="flex h-[72px] items-center justify-between gap-6">
          <Link href="/" className="flex flex-none items-center" aria-label="CHM Group 홈">
            {/* 공식 로고(원본 마스터) */}
            <img src="/logo.png" alt="CHM Group — Community Housing Management" className="block h-[34px] w-auto" />
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`hidden rounded-chm-md px-3 py-2 text-body-sm font-semibold transition-colors sm:block ${
                  isActive(n.href) ? 'text-cta' : 'text-ink-700 hover:text-cta'
                }`}
              >
                {n.label}
              </Link>
            ))}
            <Link href="/apply" className="ml-1 sm:ml-3">
              <Button tone="cta" size="sm">집수리 신청</Button>
            </Link>
          </nav>
        </Container>
      </header>
    </>
  );
}
