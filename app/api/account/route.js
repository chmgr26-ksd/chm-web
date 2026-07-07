import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// 내 프로필 수정(이름·연락처) — 로그인 회원 본인.
export async function PATCH(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = (body?.name || '').trim();
  const phone = (body?.phone || '').trim() || null;

  if (!name) {
    return NextResponse.json({ error: '이름은 필수입니다.' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone },
  });
  return NextResponse.json({ ok: true, name });
}
