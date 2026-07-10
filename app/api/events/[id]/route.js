import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';

function parseDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

// 이벤트 수정 — events:manage. 부분 갱신(발행 토글 포함).
export async function PATCH(req, props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'events:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const data = {};
  if (typeof body.title === 'string') {
    if (!body.title.trim()) return NextResponse.json({ error: '제목을 입력해 주세요.' }, { status: 400 });
    if (body.title.trim().length > 191) return NextResponse.json({ error: '제목은 191자 이하여야 합니다.' }, { status: 400 });
    data.title = body.title.trim();
  }
  if (typeof body.description === 'string') {
    if (!body.description.trim()) return NextResponse.json({ error: '내용을 입력해 주세요.' }, { status: 400 });
    if (body.description.trim().length > 20000) return NextResponse.json({ error: '내용은 20000자 이하여야 합니다.' }, { status: 400 });
    data.description = body.description.trim();
  }
  if (body.location !== undefined) {
    const loc = (body.location || '').trim();
    if (loc.length > 191) return NextResponse.json({ error: '장소는 191자 이하여야 합니다.' }, { status: 400 });
    data.location = loc || null;
  }
  if (body.startAt !== undefined) {
    const s = parseDate(body.startAt);
    if (!s) return NextResponse.json({ error: '행사 일시를 올바르게 입력해 주세요.' }, { status: 400 });
    data.startAt = s;
  }
  if (body.endAt !== undefined) {
    data.endAt = body.endAt ? parseDate(body.endAt) : null;
  }
  if (typeof body.published === 'boolean') data.published = body.published;

  try {
    await prisma.event.update({ where: { id: params.id }, data });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '행사를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  revalidatePath('/events');
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}

// 이벤트 삭제 — events:manage.
export async function DELETE(req, props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'events:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  try {
    await prisma.event.delete({ where: { id: params.id } });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '행사를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  revalidatePath('/events');
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
