import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// 참여신청 폼 → 문의 접수(공개 엔드포인트). 폼의 type 키를 enum으로 매핑.
const TYPE_MAP = { repair: 'REPAIR', edu: 'EDU', vol: 'VOL' };

export async function POST(req) {
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

  // 로그인 상태면 본인 신청으로 연결(마이페이지에서 조회 가능).
  const session = await auth();
  const userId = session?.user?.id || null;

  await prisma.inquiry.create({ data: { type, name, phone, area, message, userId } });
  return NextResponse.json({ ok: true });
}
