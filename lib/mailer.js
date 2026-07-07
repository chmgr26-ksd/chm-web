import nodemailer from 'nodemailer';

// SMTP 미설정이면 발송을 조용히 건너뜀 → 이메일 없이도 앱은 정상 동작.
// 필요한 환경변수: SMTP_HOST, SMTP_PORT(기본 587), SMTP_USER, SMTP_PASS
//                 SMTP_FROM(선택), NOTIFY_EMAIL(문의 알림 수신, 없으면 관리자 전체)

let _transporter;

export function isMailConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (_transporter !== undefined) return _transporter;
  if (!isMailConfigured()) {
    _transporter = null;
    return null;
  }
  const port = Number(process.env.SMTP_PORT || 587);
  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465=SSL, 그 외 STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return _transporter;
}

/** 메일 발송. 미설정/실패해도 throw하지 않고 결과 객체 반환. */
export async function sendMail({ to, subject, text, html }) {
  const t = getTransporter();
  if (!t || !to) return { skipped: true };
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  try {
    await t.sendMail({ from, to, subject, text, html });
    return { sent: true };
  } catch (e) {
    console.error('[mailer] 발송 실패:', e?.message || e);
    return { error: true };
  }
}
