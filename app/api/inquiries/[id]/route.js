import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const STATUSES = ['NEW', 'CONTACTED', 'SCHEDULED', 'DONE', 'CANCELED'];

// 문의 상태 변경 — 직원·관리자 전용.
export async function PATCH(req, { params }) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== 'ADMIN' && role !== 'STAFF') {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: '잘못된 상태값입니다.' }, { status: 400 });
  }

  await prisma.inquiry.update({
    where: { id: params.id },
    data: { status, handlerId: session.user.id },
  });
  return NextResponse.json({ ok: true });
}
