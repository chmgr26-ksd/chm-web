import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rateLimit';

// 비밀번호 변경 — 현재 비밀번호 확인 후 변경.
export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }
  // 현재 비밀번호 무차별 시도 방지 — 계정당 분당 5회(세션 필요 → 사용자 ID로 키잉).
  const rl = rateLimit(`pw:${session.user.id}`, { max: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: '요청이 많습니다. 잠시 후 다시 시도해 주세요.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const currentPassword = String(body?.currentPassword || '');
  const newPassword = String(body?.newPassword || '');

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: '현재 비밀번호와 새 비밀번호를 입력해 주세요.' }, { status: 400 });
  }
  if (newPassword.length < 8 || newPassword.length > 200) {
    return NextResponse.json({ error: '새 비밀번호는 8자 이상 200자 이하여야 합니다.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: '계정을 찾을 수 없습니다.' }, { status: 404 });
  }

  let ok = false;
  try {
    ok = await bcrypt.compare(currentPassword, user.passwordHash);
  } catch {
    ok = false;
  }
  if (!ok) {
    return NextResponse.json({ error: '현재 비밀번호가 올바르지 않습니다.' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  try {
    await prisma.user.update({ where: { id: session.user.id }, data: { passwordHash } });
  } catch (e) {
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: '계정을 찾을 수 없습니다. 다시 로그인해 주세요.' }, { status: 401 });
    }
    throw e;
  }
  return NextResponse.json({ ok: true });
}
