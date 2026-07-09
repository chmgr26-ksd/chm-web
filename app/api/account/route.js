import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rateLimit';

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

// 회원 탈퇴 — 본인 계정 삭제. 비밀번호 재확인 필요.
// 연관 데이터는 스키마 FK 규칙으로 처리(재설정토큰 Cascade, 문의 handler/user SetNull,
// 감사로그·소식은 비정규화 필드로 보존).
export async function DELETE(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }
  const rl = rateLimit(`account-delete:${session.user.id}`, { max: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: '요청이 많습니다. 잠시 후 다시 시도해 주세요.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const password = String(body?.password || '');

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: '계정을 찾을 수 없습니다.' }, { status: 404 });
  }

  let ok = false;
  try { ok = await bcrypt.compare(password, user.passwordHash); } catch { ok = false; }
  if (!ok) {
    return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 400 });
  }

  // 마지막 관리자 잠금 방지 — 다른 관리자가 없으면 탈퇴 차단.
  if (user.role === 'ADMIN') {
    const otherAdmins = await prisma.user.count({ where: { role: 'ADMIN', id: { not: user.id } } });
    if (otherAdmins === 0) {
      return NextResponse.json({ error: '마지막 관리자는 탈퇴할 수 없습니다. 다른 관리자를 먼저 지정해 주세요.' }, { status: 400 });
    }
  }

  try {
    await prisma.user.delete({ where: { id: user.id } });
  } catch (e) {
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: '이미 삭제된 계정입니다.' }, { status: 401 });
    }
    throw e;
  }
  return NextResponse.json({ ok: true });
}
