'use client';

import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  AppShell, Sidebar, SidebarSection, SidebarItem, Topbar, Avatar, Button,
} from '@chm/design-system';
import { can, ROLE_LABEL } from '@/lib/rbac';

export default function DashboardShell({ user, newCount = 0, children }) {
  const pathname = usePathname();
  const canManageMembers = can(user, 'members:manage');
  const roleLabel = ROLE_LABEL[user?.role] || '직원';
  // 프록시 뒤 0.0.0.0 리다이렉트 회피 — 클라이언트가 상대경로로 이동.
  const logout = async () => {
    await signOut({ redirect: false });
    window.location.href = '/';
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <AppShell
        sidebar={
          <Sidebar
            footer={
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar name={user?.name || '사용자'} value="trust" size="sm" />
                  <div className="min-w-0">
                    <div className="truncate text-body-sm font-semibold text-ink-800">{user?.name}</div>
                    <div className="text-caption text-ink-500">{roleLabel}</div>
                  </div>
                </div>
                <Button variant="ghost" tone="ink" size="sm" onClick={logout}>로그아웃</Button>
              </div>
            }
          >
            <SidebarSection label="현황">
              <SidebarItem href="/dashboard" active={pathname === '/dashboard'} badge={newCount || undefined}>대시보드 · 신청</SidebarItem>
              <SidebarItem href="/dashboard/posts" active={pathname.startsWith('/dashboard/posts')}>소식 관리</SidebarItem>
            </SidebarSection>
            {canManageMembers && (
              <SidebarSection label="관리">
                <SidebarItem href="/dashboard/members" active={pathname.startsWith('/dashboard/members')}>회원 관리</SidebarItem>
                <SidebarItem href="/dashboard/settings" active={pathname.startsWith('/dashboard/settings')}>알림 설정</SidebarItem>
              </SidebarSection>
            )}
            <SidebarSection label="바로가기">
              <SidebarItem href="/account">마이페이지</SidebarItem>
              <SidebarItem href="/">공개 사이트</SidebarItem>
            </SidebarSection>
          </Sidebar>
        }
        topbar={
          <Topbar
            actions={
              <div className="flex items-center gap-3">
                <a href="/" className="text-body-sm font-semibold text-ink-600 hover:text-primary">사이트로</a>
                <Avatar name={user?.name || '사용자'} value="trust" size="sm" />
              </div>
            }
          >
            <div className="text-h4 font-semibold text-ink-800">업무 플랫폼</div>
          </Topbar>
        }
      >
        {children}
      </AppShell>
    </div>
  );
}
