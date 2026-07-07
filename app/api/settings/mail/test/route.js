import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { getMailConfig, sendMail } from '@/lib/mailer';

// 테스트 메일 발송 — 저장된 설정으로 수신자에게 1통 발송(관리자).
export async function POST() {
  const session = await auth();
  if (!can(session?.user, 'settings:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const cfg = await getMailConfig();
  if (!cfg || !cfg.pass) {
    return NextResponse.json({ error: 'SMTP 설정이 완료되지 않았습니다. 먼저 저장해 주세요.' }, { status: 400 });
  }

  let to = cfg.recipients?.trim();
  if (!to) {
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { email: true } });
    to = admins.map((a) => a.email).join(',');
  }
  if (!to) {
    return NextResponse.json({ error: '수신 이메일이 없습니다. 수신자를 입력하거나 관리자 이메일을 확인해 주세요.' }, { status: 400 });
  }

  const result = await sendMail({
    to,
    subject: '[CHM] 알림 테스트 메일',
    text: '이 메일이 보이면 알림 설정이 정상입니다. — CHM Group 업무 플랫폼',
    cfg,
  });
  if (result.sent) {
    return NextResponse.json({ ok: true, to });
  }
  return NextResponse.json({ error: result.message || '발송에 실패했습니다. 설정을 확인해 주세요.' }, { status: 500 });
}
