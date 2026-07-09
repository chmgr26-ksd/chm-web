import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/mailer';
import { rateLimitByIp } from '@/lib/rateLimit';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://forestgreen-sheep-120944.hostingersite.com';
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1시간

// 비밀번호 재설정 요청 — 이메일로 재설정 링크 발송.
// 계정 열거 방지를 위해 존재 여부와 무관하게 항상 동일한 성공 응답을 준다.
export async function POST(req) {
  const rl = rateLimitByIp(req, 'forgot-pw', { max: 5, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: '요청이 많습니다. 잠시 후 다시 시도해 주세요.' }, { status: 429 });

  const body = await req.json().catch(() => null);
  const email = (body?.email || '').toLowerCase().trim();

  const generic = NextResponse.json({ ok: true });
  if (!email || email.length > 191 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return generic;

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true } });
  if (!user) return generic; // 존재하지 않아도 성공처럼 응답(열거 방지)

  // 원본 토큰은 메일로만, DB엔 sha256 해시만 저장.
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  // 기존 미사용 토큰 정리 후 새 토큰 발급(활성 토큰 1개 유지).
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });
  await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });

  const link = `${SITE_URL}/reset-password?token=${rawToken}`;
  // 메일 발송(SMTP 미설정 시 skipped). fire-and-forget — 응답을 지연/실패시키지 않음.
  sendMail({
    to: email,
    subject: '[CHM] 비밀번호 재설정 안내',
    text:
      `${user.name || ''}님, 아래 링크에서 비밀번호를 재설정할 수 있습니다. (1시간 동안 유효)\n\n` +
      `${link}\n\n` +
      `본인이 요청하지 않았다면 이 메일을 무시하세요. 비밀번호는 변경되지 않습니다.\n\n— CHM Group`,
  })
    .then((r) => { if (r?.skipped) console.warn('[forgot-pw] SMTP 미설정 — 재설정 메일 미발송'); })
    .catch((e) => console.error('[forgot-pw] 메일 실패:', e?.message || e));

  return generic;
}
