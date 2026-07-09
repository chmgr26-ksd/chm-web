import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { encrypt } from '@/lib/crypto';

// 현재 메일 설정 조회 — 비밀번호는 절대 반환하지 않음(hasPassword만).
export async function GET() {
  const session = await auth();
  if (!can(session?.user, 'settings:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  const s = await prisma.appSetting.findUnique({ where: { id: 'singleton' } });
  return NextResponse.json({
    mailEnabled: s?.mailEnabled ?? false,
    mailRecipients: s?.mailRecipients ?? '',
    smtpHost: s?.smtpHost ?? '',
    smtpPort: s?.smtpPort ?? 587,
    smtpUser: s?.smtpUser ?? '',
    smtpFrom: s?.smtpFrom ?? '',
    hasPassword: !!s?.smtpPassEnc,
    // DB 설정이 없고 환경변수로만 동작 중인지 표시
    envFallback: !s?.smtpHost && !!process.env.SMTP_HOST,
  });
}

// 메일 설정 저장(관리자). 비밀번호는 입력된 경우에만 암호화 갱신.
export async function PATCH(req) {
  const session = await auth();
  if (!can(session?.user, 'settings:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));

  // 포트 검증 — 비숫자/범위초과 시 NaN 저장으로 인한 500 방지.
  let smtpPort = 587;
  if (body.smtpPort !== undefined && body.smtpPort !== '' && body.smtpPort !== null) {
    const p = Number.parseInt(body.smtpPort, 10);
    if (!Number.isInteger(p) || p < 1 || p > 65535) {
      return NextResponse.json({ error: '포트는 1~65535 사이 숫자여야 합니다.' }, { status: 400 });
    }
    smtpPort = p;
  }

  const smtpHost = (body.smtpHost || '').trim() || null;
  const smtpUser = (body.smtpUser || '').trim() || null;
  const smtpFrom = (body.smtpFrom || '').trim() || null;
  if ((smtpHost && smtpHost.length > 191) || (smtpUser && smtpUser.length > 191) || (smtpFrom && smtpFrom.length > 191)) {
    return NextResponse.json({ error: '입력이 너무 깁니다.' }, { status: 400 });
  }

  const data = {
    mailEnabled: !!body.mailEnabled,
    mailRecipients: (body.mailRecipients || '').trim() || null,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpFrom,
  };
  if (body.smtpPassword) {
    data.smtpPassEnc = encrypt(String(body.smtpPassword));
  }

  // Prisma upsert는 동시 '최초 생성'에 원자적이지 않다(두 요청이 동시에 없는 행을
  // 만들면 한쪽이 PK 'singleton' 유니크 충돌 P2002). 진 쪽은 이미 행이 존재하므로 update로 재시도.
  try {
    await prisma.appSetting.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data },
    });
  } catch (e) {
    if (e?.code === 'P2002') {
      await prisma.appSetting.update({ where: { id: 'singleton' }, data });
    } else {
      throw e;
    }
  }
  return NextResponse.json({ ok: true });
}
