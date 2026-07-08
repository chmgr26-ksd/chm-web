import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notifyAdmins } from '@/lib/mailer';
import { rateLimit, clientIp } from '@/lib/rateLimit';

// 참여신청 폼 → 문의 접수(공개 엔드포인트). 폼의 type 키를 enum으로 매핑.
const TYPE_MAP = { repair: 'REPAIR', edu: 'EDU', vol: 'VOL' };
const TYPE_LABEL = { REPAIR: '집수리 서비스', EDU: '집수리 교실', VOL: '자원봉사·협력' };

// 신규 문의 알림(설정된 수신자/관리자에게). 미설정·실패여도 접수에는 영향 없음.
function notifyNewInquiry({ type, name, phone, area, message }) {
  const label = TYPE_LABEL[type] || type;
  return notifyAdmins({
    subject: `[CHM] 새 문의 접수 — ${name} (${label})`,
    text:
      `새로운 참여 신청이 접수되었습니다.\n\n` +
      `유형: ${label}\n성함: ${name}\n연락처: ${phone}\n` +
      `거주 지역: ${area || '-'}\n내용: ${message || '-'}\n\n` +
      `대시보드에서 확인해 주세요.`,
  });
}

export async function POST(req) {
  // 스팸·메일 폭탄 방지 — IP당 분당 5회.
  const rl = rateLimit(`inquiry:${clientIp(req)}`, { max: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: '요청이 많습니다. 잠시 후 다시 시도해 주세요.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });

  const name = (body.name || '').trim();
  const phone = (body.phone || '').trim();
  const type = TYPE_MAP[body.type];
  const area = (body.area || '').trim() || null;
  const message = (body.message || body.msg || '').trim() || null;

  if (!name || !phone) {
    return NextResponse.json({ error: '성함과 연락처는 필수입니다.' }, { status: 400 });
  }
  if (!type) {
    return NextResponse.json({ error: '신청 유형이 올바르지 않습니다.' }, { status: 400 });
  }
  // 컬럼 길이 초과·과대 페이로드 방지(name/phone/area=VARCHAR(191), message=TEXT).
  if (name.length > 100 || phone.length > 30 || (area && area.length > 100) || (message && message.length > 5000)) {
    return NextResponse.json({ error: '입력이 너무 깁니다.' }, { status: 400 });
  }

  // 로그인 상태면 본인 신청으로 연결(마이페이지에서 조회 가능).
  const session = await auth();
  const userId = session?.user?.id || null;

  await prisma.inquiry.create({ data: { type, name, phone, area, message, userId } });

  // 관리자 알림 메일 — fire-and-forget(접수 응답을 지연/실패시키지 않음).
  notifyNewInquiry({ type, name, phone, area, message }).catch((e) =>
    console.error('[inquiry] 알림 메일 실패:', e?.message || e)
  );

  return NextResponse.json({ ok: true });
}
