import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { rateLimitByIp } from '@/lib/rateLimit';

export async function POST(req) {
  // 남용 방지 — IP당 분당 5회.
  const rl = rateLimitByIp(req, 'signup', { max: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: '요청이 많습니다. 잠시 후 다시 시도해 주세요.' }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').toLowerCase().trim();
  const password = String(body.password || '');
  const phone = (body.phone || '').trim() || null;

  if (!name || !email || !password) {
    return NextResponse.json({ error: '이름·이메일·비밀번호는 필수입니다.' }, { status: 400 });
  }
  // VARCHAR(191) 컬럼 초과 방지.
  if (name.length > 100 || email.length > 191 || (phone && phone.length > 30)) {
    return NextResponse.json({ error: '입력이 너무 깁니다.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: '이메일 형식이 올바르지 않습니다.' }, { status: 400 });
  }
  if (password.length < 8 || password.length > 200) {
    return NextResponse.json({ error: '비밀번호는 8자 이상 200자 이하여야 합니다.' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: { name, email, phone, passwordHash }, // role 기본값 USER
    });
  } catch (e) {
    // 유니크 제약(이메일 중복) 경합 — 사전 조회 없이 DB로 판정.
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: '이미 가입된 이메일입니다.' }, { status: 409 });
    }
    throw e;
  }

  return NextResponse.json({ ok: true });
}
