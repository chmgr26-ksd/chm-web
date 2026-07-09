import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can, isValidRole } from '@/lib/rbac';

// 회원 권한 변경 — members:manage 권한(관리자), 본인은 변경 불가. 변경 시 감사 로그 기록.
export async function PATCH(req, { params }) {
  const session = await auth();
  if (!can(session?.user, 'members:manage')) {
    return NextResponse.json({ error: '관리자만 변경할 수 있습니다.' }, { status: 403 });
  }
  if (params.id === session.user.id) {
    return NextResponse.json({ error: '본인 권한은 변경할 수 없습니다.' }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const role = body?.role;
  if (!isValidRole(role)) {
    return NextResponse.json({ error: '잘못된 역할입니다.' }, { status: 400 });
  }

  // read-modify-write(현재 역할 읽기 → 다르면 변경+감사로그)를 하나의 트랜잭션에서
  // 대상 행을 FOR UPDATE로 잠근 뒤 수행. 동시 권한 변경이 끼어들어 감사 로그의
  // fromRole이 실제 이전 값과 어긋나거나 이중 기록되는 것을 방지한다(트랜잭션은 짧게 유지).
  let outcome;
  try {
    outcome = await prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw`SELECT role, email FROM \`User\` WHERE id = ${params.id} FOR UPDATE`;
      const target = rows[0];
      if (!target) return { status: 404 };
      if (target.role !== role) {
        await tx.user.update({ where: { id: params.id }, data: { role } });
        await tx.roleChangeLog.create({
          data: {
            actorId: session.user.id,
            actorEmail: session.user.email,
            targetId: params.id,
            targetEmail: target.email,
            fromRole: target.role,
            toRole: role,
          },
        });
      }
      return { status: 200 };
    });
  } catch (e) {
    console.error('[users:role] 변경 실패:', e?.message || e);
    return NextResponse.json({ error: '변경에 실패했습니다.' }, { status: 500 });
  }

  if (outcome.status === 404) {
    return NextResponse.json({ error: '회원을 찾을 수 없습니다.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
