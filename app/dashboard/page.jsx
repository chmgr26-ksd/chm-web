import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  AppShell, Sidebar, SidebarSection, SidebarItem, Topbar,
  PageHeader, Stat, Badge, Avatar, Button, EmptyState,
  Table, THead, TBody, TR, TH, TD,
} from '@chm/design-system';
import InquiryStatusSelect from './InquiryStatusSelect';

// 세션·DB에 의존하므로 항상 동적 렌더.
export const dynamic = 'force-dynamic';

const TYPE_LABEL = { REPAIR: '집수리 서비스', EDU: '집수리 교실', VOL: '자원봉사·협력' };
const TYPE_VALUE = { REPAIR: 'selfreliance', EDU: 'trust', VOL: 'community' };
const STATUS_LABEL = { NEW: '접수', CONTACTED: '확인 연락', SCHEDULED: '일정 조율', DONE: '완료', CANCELED: '취소' };
const STATUS_VALUE = { NEW: 'trust', CONTACTED: 'community', SCHEDULED: 'selfreliance', DONE: 'cooperation', CANCELED: 'innovation' };

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())} ${p(dt.getHours())}:${p(dt.getMinutes())}`;
}

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;
  const roleLabel = user?.role === 'ADMIN' ? '관리자' : '직원';

  const [total, byStatus, byType, recent] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.inquiry.groupBy({ by: ['type'], _count: { _all: true } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
  ]);

  const statusCount = Object.fromEntries(byStatus.map((r) => [r.status, r._count._all]));
  const typeCount = Object.fromEntries(byType.map((r) => [r.type, r._count._all]));
  const inProgress = (statusCount.CONTACTED || 0) + (statusCount.SCHEDULED || 0);

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
                <form
                  action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/login' });
                  }}
                >
                  <Button type="submit" variant="ghost" tone="ink" size="sm">로그아웃</Button>
                </form>
              </div>
            }
          >
            <SidebarSection label="현황">
              <SidebarItem active>대시보드</SidebarItem>
            </SidebarSection>
            <SidebarSection label="업무">
              <SidebarItem badge={statusCount.NEW || undefined}>집수리 신청</SidebarItem>
              <SidebarItem>회원 관리</SidebarItem>
            </SidebarSection>
            <SidebarSection label="바로가기">
              <SidebarItem>공개 사이트</SidebarItem>
            </SidebarSection>
          </Sidebar>
        }
        topbar={
          <Topbar
            actions={
              <div className="flex items-center gap-3">
                <Link href="/" className="text-body-sm font-semibold text-ink-600 hover:text-primary">사이트로</Link>
                <Avatar name={user?.name || '사용자'} value="trust" size="sm" />
              </div>
            }
          >
            <div className="text-h4 font-semibold text-ink-800">대시보드</div>
          </Topbar>
        }
      >
        <PageHeader
          title={`안녕하세요, ${user?.name || ''}님`}
          description="집수리 신청·문의 현황입니다."
        />

        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <Stat label="전체 신청" value={String(total)} unit="건" accent="trust" />
          <Stat label="신규 접수" value={String(statusCount.NEW || 0)} unit="건" accent="selfreliance" />
          <Stat label="처리 중" value={String(inProgress)} unit="건" accent="community" />
          <Stat label="완료" value={String(statusCount.DONE || 0)} unit="건" accent="cooperation" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {['REPAIR', 'EDU', 'VOL'].map((t) => (
            <Badge key={t} value={TYPE_VALUE[t]} dot>
              {TYPE_LABEL[t]} {typeCount[t] || 0}
            </Badge>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-h4 font-bold text-ink-800">최근 신청</h2>
          {recent.length === 0 ? (
            <EmptyState
              title="아직 접수된 신청이 없습니다"
              description="공개 사이트의 참여 신청 폼으로 문의가 접수되면 여기에 표시됩니다."
            />
          ) : (
            <div className="overflow-x-auto rounded-chm-lg border border-border">
              <Table>
                <THead>
                  <TR>
                    <TH>유형</TH>
                    <TH>성함</TH>
                    <TH>연락처</TH>
                    <TH>지역</TH>
                    <TH>접수일</TH>
                    <TH>상태</TH>
                  </TR>
                </THead>
                <TBody>
                  {recent.map((q) => (
                    <TR key={q.id}>
                      <TD><Badge value={TYPE_VALUE[q.type]}>{TYPE_LABEL[q.type]}</Badge></TD>
                      <TD>{q.name}</TD>
                      <TD>{q.phone}</TD>
                      <TD>{q.area || '—'}</TD>
                      <TD>{fmtDate(q.createdAt)}</TD>
                      <TD><InquiryStatusSelect id={q.id} value={q.status} /></TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          )}
        </div>
      </AppShell>
    </div>
  );
}
