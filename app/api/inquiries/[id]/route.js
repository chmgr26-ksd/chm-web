import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';

const STATUSES = ['NEW', 'CONTACTED', 'SCHEDULED', 'DONE', 'CANCELED'];

// 문의 상태 변경 — inquiry:manage 권한(직원·관리자).
export async function PATCH(req, { params }) {
  const session = await auth();
  if (!can(session?.user, 'inquiry:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: '잘못된 상태값입니다.' }, { status: 400 });
  }

  try {
    await prisma.inquiry.update({
      where: { id: params.id },
      data: { status, handlerId: session.user.id },
    });
  } catch (e) {
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: '문의를 찾을 수 없습니다.' }, { status: 404 });
    }
    throw e;
  }
  return NextResponse.json({ ok: true });
}
