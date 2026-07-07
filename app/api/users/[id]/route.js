import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const ROLES = ['USER', 'STAFF', 'ADMIN'];

// 회원 권한 변경 — 관리자 전용, 본인은 변경 불가.
export async function PATCH(req, { params }) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: '관리자만 변경할 수 있습니다.' }, { status: 403 });
  }
  if (params.id === session.user.id) {
    return NextResponse.json({ error: '본인 권한은 변경할 수 없습니다.' }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const role = body?.role;
  if (!ROLES.includes(role)) {
    return NextResponse.json({ error: '잘못된 역할입니다.' }, { status: 400 });
  }

  await prisma.user.update({ where: { id: params.id }, data: { role } });
  return NextResponse.json({ ok: true });
}
