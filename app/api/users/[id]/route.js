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

  const target = await prisma.user.findUnique({
    where: { id: params.id },
    select: { role: true, email: true },
  });
  if (!target) {
    return NextResponse.json({ error: '회원을 찾을 수 없습니다.' }, { status: 404 });
  }

  // 실제 변경이 있을 때만 갱신 + 감사 로그(원자적).
  if (target.role !== role) {
    await prisma.$transaction([
      prisma.user.update({ where: { id: params.id }, data: { role } }),
      prisma.roleChangeLog.create({
        data: {
          actorId: session.user.id,
          actorEmail: session.user.email,
          targetId: params.id,
          targetEmail: target.email,
          fromRole: target.role,
          toRole: role,
        },
      }),
    ]);
  }

  return NextResponse.json({ ok: true });
}
