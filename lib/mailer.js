import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';

// 메일 설정 조회 — DB(AppSetting) 우선, 없으면 환경변수 폴백.
// 반환: { source, enabled, host, port, user, pass, from, recipients } 또는 null.
export async function getMailConfig() {
  const s = await prisma.appSetting.findUnique({ where: { id: 'singleton' } }).catch(() => null);
  if (s?.smtpHost && s?.smtpUser && s?.smtpPassEnc) {
    let pass = '';
    try { pass = decrypt(s.smtpPassEnc); } catch { pass = ''; }
    if (pass) {
      return {
        source: 'db',
        enabled: s.mailEnabled,
        host: s.smtpHost,
        port: s.smtpPort || 587,
        user: s.smtpUser,
        pass,
        from: s.smtpFrom || s.smtpUser,
        recipients: s.mailRecipients || '',
      };
    }
  }
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      source: 'env',
      enabled: true,
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      recipients: process.env.NOTIFY_EMAIL || '',
    };
  }
  return null;
}

function makeTransport(cfg) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465, // 465=SSL, 그 외 STARTTLS
    auth: { user: cfg.user, pass: cfg.pass },
  });
}

/** 지정 수신자에게 발송. 미설정/실패해도 throw하지 않음. cfg 주입 가능(테스트용). */
export async function sendMail({ to, subject, text, html, cfg }) {
  const config = cfg || (await getMailConfig());
  if (!config || !config.pass || !to) return { skipped: true };
  try {
    await makeTransport(config).sendMail({ from: config.from, to, subject, text, html });
    return { sent: true };
  } catch (e) {
    console.error('[mailer] 발송 실패:', e?.message || e);
    return { error: true, message: e?.message || '발송 실패' };
  }
}

/** 관리자/설정 수신자에게 알림 발송. enabled=false면 스킵. */
export async function notifyAdmins({ subject, text, html }) {
  const config = await getMailConfig();
  if (!config || !config.enabled || !config.pass) return { skipped: true };
  let to = config.recipients?.trim();
  if (!to) {
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { email: true } });
    to = admins.map((a) => a.email).join(',');
  }
  if (!to) return { skipped: true };
  return sendMail({ to, subject, text, html, cfg: config });
}
