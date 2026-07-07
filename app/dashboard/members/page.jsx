import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import {
  PageHeader, Badge, EmptyState,
  Table, THead, TBody, TR, TH, TD,
} from '@chm/design-system';
import { can, ROLE_LABEL } from '@/lib/rbac';
import RoleSelect from './RoleSelect';

export const dynamic = 'force-dynamic';

const ROLE_VALUE = { ADMIN: 'innovation', STAFF: 'trust', USER: 'cooperation' };

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())}`;
}

export default async function MembersPage() {
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

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { inquiries: true } } },
  });

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
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </>
  );
}
