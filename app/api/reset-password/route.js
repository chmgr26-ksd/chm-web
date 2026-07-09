import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { rateLimitByIp } from '@/lib/rateLimit';

// 비밀번호 재설정 확정 — 토큰 검증 후 새 비밀번호로 갱신(1회용·원자적).
export async function POST(req) {
  const rl = rateLimitByIp(req, 'reset-pw', { max: 10, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: '요청이 많습니다. 잠시 후 다시 시도해 주세요.' }, { status: 429 });

  const body = await req.json().catch(() => null);
  const token = String(body?.token || '');
  const newPassword = String(body?.newPassword || '');
  if (!token) return NextResponse.json({ error: '유효하지 않은 요청입니다.' }, { status: 400 });
  if (newPassword.length < 8 || newPassword.length > 200) {
    return NextResponse.json({ error: '새 비밀번호는 8자 이상 200자 이하여야 합니다.' }, { status: 400 });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // 사전 검사 — 명백히 무효한 토큰에 bcrypt 비용을 쓰지 않도록(원자성은 아래 트랜잭션이 보장).
  const pre = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { usedAt: true, expiresAt: true },
  });
  if (!pre || pre.usedAt || pre.expiresAt < new Date()) {
    return NextResponse.json({ error: '만료되었거나 이미 사용된 링크입니다. 다시 요청해 주세요.' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10); // 트랜잭션 밖(긴 연산)

  // 조건부 원자 클레임 + 비번 갱신을 하나의 트랜잭션에서(짧게).
  //  - usedAt IS NULL & 미만료일 때만 사용 처리 → affected rows로 '정확히 1회 소비' 보장.
  //  - 갱신 실패 시 롤백 → 토큰 미소비(재시도 가능). 부분 반영 없음.
  const result = await prisma.$transaction(async (tx) => {
    const claim = await tx.passwordResetToken.updateMany({
      where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    });
    if (claim.count === 0) return { ok: false };
    const rec = await tx.passwordResetToken.findUnique({ where: { tokenHash }, select: { userId: true } });
    await tx.user.update({ where: { id: rec.userId }, data: { passwordHash } });
    return { ok: true };
  });

  if (!result.ok) {
    return NextResponse.json({ error: '만료되었거나 이미 사용된 링크입니다. 다시 요청해 주세요.' }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
