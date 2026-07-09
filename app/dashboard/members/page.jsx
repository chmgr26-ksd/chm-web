import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  PageHeader, Badge, EmptyState,
  Table, THead, TBody, TR, TH, TD,
} from '@chm/design-system';
import { can, ROLE_LABEL } from '@/lib/rbac';
import RoleSelect from './RoleSelect';
import DeleteUser from './DeleteUser';
import Pager from '../Pager';

export const dynamic = 'force-dynamic';
const PAGE_SIZE = 20;

const ROLE_VALUE = { ADMIN: 'innovation', STAFF: 'trust', USER: 'cooperation' };

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())}`;
}

function fmtDateTime(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())} ${p(dt.getHours())}:${p(dt.getMinutes())}`;
}

export default async function MembersPage({ searchParams }) {
  const session = await auth();
  const me = session.user;

  // 회원 관리는 members:view 권한(관리자) 전용 — 직접 접근도 차단.
  if (!can(me, 'members:view')) {
    return (
      <>
        <PageHeader title="회원 관리" />
        <EmptyState title="관리자 전용" description="회원 권한 관리는 관리자만 접근할 수 있습니다." />
      </>
    );
  }

  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);
  const [total, users, roleLogs] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      // passwordHash 등 민감 컬럼을 서버 메모리로 로드하지 않도록 필요한 필드만 선택.
      select: {
        id: true, name: true, email: true, phone: true, role: true, createdAt: true,
        _count: { select: { inquiries: true } },
      },
    }),
    prisma.roleChangeLog.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="회원 관리"
        description="회원 목록과 권한(일반 회원 · 직원 · 관리자)을 관리합니다."
      />
      <div className="overflow-x-auto rounded-chm-lg border border-border">
        <Table>
          <THead>
            <TR>
              <TH>이름</TH>
              <TH>이메일</TH>
              <TH>연락처</TH>
              <TH>가입일</TH>
              <TH>신청</TH>
              <TH>권한</TH>
              <TH align="right">관리</TH>
            </TR>
          </THead>
          <TBody>
            {users.map((u) => (
              <TR key={u.id}>
                <TD>
                  {u.name}
                  {u.id === me.id && <span className="ml-1 text-caption text-ink-500">(나)</span>}
                </TD>
                <TD>{u.email}</TD>
                <TD>{u.phone || '—'}</TD>
                <TD>{fmtDate(u.createdAt)}</TD>
                <TD>{u._count.inquiries}</TD>
                <TD>
                  {u.id === me.id ? (
                    <Badge value={ROLE_VALUE[u.role]}>{ROLE_LABEL[u.role]}</Badge>
                  ) : (
                    <RoleSelect id={u.id} value={u.role} />
                  )}
                </TD>
                <TD align="right">
                  {u.id !== me.id && <DeleteUser id={u.id} name={u.name} />}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>

      <Pager page={page} pageCount={pageCount} basePath="/dashboard/members" />

      {/* 권한 변경 이력(감사 로그) */}
      <div className="mt-10">
        <h2 className="mb-3 text-h4 font-bold text-ink-800">권한 변경 이력</h2>
        {roleLogs.length === 0 ? (
          <EmptyState title="변경 이력이 없습니다" description="회원 권한을 변경하면 여기에 기록됩니다." />
        ) : (
          <div className="overflow-x-auto rounded-chm-lg border border-border">
            <Table>
              <THead>
                <TR>
                  <TH>일시</TH>
                  <TH>대상</TH>
                  <TH>변경</TH>
                  <TH>처리자</TH>
                </TR>
              </THead>
              <TBody>
                {roleLogs.map((log) => (
                  <TR key={log.id}>
                    <TD>{fmtDateTime(log.createdAt)}</TD>
                    <TD>{log.targetEmail}</TD>
                    <TD>
                      <span className="inline-flex items-center gap-1.5">
                        <Badge value={ROLE_VALUE[log.fromRole]}>{ROLE_LABEL[log.fromRole]}</Badge>
                        <span className="text-ink-400">→</span>
                        <Badge value={ROLE_VALUE[log.toRole]}>{ROLE_LABEL[log.toRole]}</Badge>
                      </span>
                    </TD>
                    <TD>{log.actorEmail}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
