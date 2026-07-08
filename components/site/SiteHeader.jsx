'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button, NoticeBar, Container, Avatar } from '@chm/design-system';
import { can, ROLE_LABEL } from '@/lib/rbac';
import { avatarColor } from '@/lib/avatarColor';
import { NAV } from './constants';

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const canDashboard = can(user, 'dashboard:access');
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const close = () => setOpen(false);
  // Auth.js가 프록시 뒤에서 절대 URL을 0.0.0.0:3000으로 만드는 문제를 피하려
  // 서버 리다이렉트 대신 클라이언트가 현재 공개 도메인의 상대경로로 이동.
  const logout = async () => {
    await signOut({ redirect: false });
    window.location.href = '/';
  };

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

            {/* 계정 영역 */}
            {status === 'authenticated' ? (
              <div className="ml-1 flex items-center gap-2 border-l border-border pl-3">
                {canDashboard && (
                  <Link href="/dashboard" className="rounded-chm-md px-3 py-2 text-body-sm font-semibold text-primary hover:bg-primary-soft">
                    대시보드
                  </Link>
                )}
                <Link href="/account" className="flex items-center gap-1.5 rounded-chm-md px-1.5 py-1 text-body-sm text-ink-600 hover:bg-ink-100" title="마이페이지">
                  <Avatar name={user?.name || '회원'} src={user?.image || undefined} value={avatarColor(user?.name || '회원')} size="sm" />
                  <span className="max-w-[7rem] truncate font-semibold text-ink-800">{user?.name}</span>
                </Link>
                <button type="button" onClick={logout} className="rounded-chm-md px-2.5 py-2 text-body-sm font-semibold text-ink-500 hover:bg-ink-100 hover:text-ink-800">
                  로그아웃
                </button>
              </div>
            ) : (
              <Link href="/login" className="ml-1 border-l border-border pl-3 pr-1 text-body-sm font-semibold text-ink-700 hover:text-cta">
                로그인
              </Link>
            )}

            <Button as={Link} href="/apply" tone="cta" size="sm" className="ml-1">집수리 신청</Button>
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

              <div className="my-1 border-t border-border" />

              {status === 'authenticated' ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 text-body-sm text-ink-600">
                    <Avatar name={user?.name || '회원'} src={user?.image || undefined} value={avatarColor(user?.name || '회원')} size="sm" />
                    <span className="font-semibold text-ink-800">{user?.name}</span>
                    <span className="text-caption text-ink-500">
                      {ROLE_LABEL[user?.role] || '회원'}
                    </span>
                  </div>
                  <Link href="/account" onClick={close} className="rounded-chm-md px-3 py-2.5 text-body font-semibold text-ink-700 hover:bg-ink-100">
                    마이페이지
                  </Link>
                  {canDashboard && (
                    <Link href="/dashboard" onClick={close} className="rounded-chm-md px-3 py-2.5 text-body font-semibold text-primary hover:bg-primary-soft">
                      대시보드
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => { close(); logout(); }}
                    className="rounded-chm-md px-3 py-2.5 text-left text-body font-semibold text-ink-600 hover:bg-ink-100"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={close} className="rounded-chm-md px-3 py-2.5 text-body font-semibold text-ink-700 hover:bg-ink-100">로그인</Link>
                  <Link href="/signup" onClick={close} className="rounded-chm-md px-3 py-2.5 text-body font-semibold text-ink-700 hover:bg-ink-100">회원가입</Link>
                </>
              )}

              <Button as={Link} href="/apply" tone="cta" size="md" className="mt-2" onClick={close}>집수리 신청</Button>
            </Container>
          </div>
        )}
      </header>
    </>
  );
}
