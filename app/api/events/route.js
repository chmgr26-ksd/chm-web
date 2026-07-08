import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';

// datetime-local 문자열(YYYY-MM-DDTHH:mm)을 Date로. 서버 TZ(Asia/Seoul) 기준 해석.
function parseDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

// 이벤트 작성 — events:manage(직원·관리자).
export async function POST(req) {
  const session = await auth();
  if (!can(session?.user, 'events:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const title = (body.title || '').trim();
  const description = (body.description || '').trim();
  const location = (body.location || '').trim() || null;
  const startAt = parseDate(body.startAt);
  const endAt = parseDate(body.endAt);
  const published = body.published !== false;

  if (!title || !description) {
    return NextResponse.json({ error: '제목과 내용을 입력해 주세요.' }, { status: 400 });
  }
  if (title.length > 191 || (location && location.length > 191) || description.length > 20000) {
    return NextResponse.json({ error: '입력이 너무 깁니다.' }, { status: 400 });
  }
  if (!startAt) {
    return NextResponse.json({ error: '행사 일시를 올바르게 입력해 주세요.' }, { status: 400 });
  }
  if (endAt && endAt < startAt) {
    return NextResponse.json({ error: '종료 일시가 시작 일시보다 빠를 수 없습니다.' }, { status: 400 });
  }

  const ev = await prisma.event.create({
    data: { title, description, location, startAt, endAt, published },
  });
  revalidatePath('/events');
  revalidatePath('/');
  return NextResponse.json({ ok: true, id: ev.id });
}
