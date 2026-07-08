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
  if (name.length > 100 || (phone && phone.length > 30)) {
    return NextResponse.json({ error: '입력이 너무 깁니다.' }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, phone },
    });
  } catch (e) {
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: '계정을 찾을 수 없습니다. 다시 로그인해 주세요.' }, { status: 401 });
    }
    throw e;
  }
  return NextResponse.json({ ok: true, name });
}
