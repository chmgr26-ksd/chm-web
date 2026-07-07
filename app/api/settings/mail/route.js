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
  const data = {
    mailEnabled: !!body.mailEnabled,
    mailRecipients: (body.mailRecipients || '').trim() || null,
    smtpHost: (body.smtpHost || '').trim() || null,
    smtpPort: body.smtpPort ? Number(body.smtpPort) : 587,
    smtpUser: (body.smtpUser || '').trim() || null,
    smtpFrom: (body.smtpFrom || '').trim() || null,
  };
  if (body.smtpPassword) {
    data.smtpPassEnc = encrypt(String(body.smtpPassword));
  }

  await prisma.appSetting.upsert({
    where: { id: 'singleton' },
    update: data,
    create: { id: 'singleton', ...data },
  });
  return NextResponse.json({ ok: true });
}
