import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can, isValidRole } from '@/lib/rbac';

// 회원 권한 변경 — members:manage 권한(관리자), 본인은 변경 불가.
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

  try {
    await prisma.user.update({ where: { id: params.id }, data: { role } });
  } catch (e) {
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: '회원을 찾을 수 없습니다.' }, { status: 404 });
    }
    throw e;
  }
  return NextResponse.json({ ok: true });
}
