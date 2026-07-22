import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { sanitizeHtml, isBlankHtml } from '@/lib/sanitizeHtml';

const TITLE_MAX = 191;
const BODY_MAX = 40000;

function revalidateReview(type) {
  revalidatePath(type === 'EXPERIENCE' ? '/reviews/experience' : '/reviews/class');
}

// 후기 필드 수정 — reviews:manage. 이미지는 별도 엔드포인트.
export async function PATCH(req, props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'reviews:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const existing = await prisma.review.findUnique({ where: { id: params.id }, select: { type: true } });
  if (!existing) return NextResponse.json({ error: '후기를 찾을 수 없습니다.' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const data = {};
  if (body.title !== undefined) {
    const title = body.title.toString().trim();
    if (!title || title.length > TITLE_MAX) return NextResponse.json({ error: '제목을 확인해 주세요.' }, { status: 400 });
    data.title = title;
  }
  if (body.body !== undefined) {
    const raw = body.body.toString();
    if (isBlankHtml(raw)) return NextResponse.json({ error: '내용을 확인해 주세요.' }, { status: 400 });
    data.body = sanitizeHtml(raw, { maxLen: BODY_MAX });
  }
  if (body.authorName !== undefined) {
    const a = body.authorName.toString().trim();
    data.authorName = a ? a.slice(0, TITLE_MAX) : null;
  }
  if (body.published !== undefined) data.published = body.published !== false;

  await prisma.review.update({ where: { id: params.id }, data });
  revalidateReview(existing.type);
  return NextResponse.json({ ok: true });
}

// 후기 삭제 — reviews:manage. 이미지는 FK Cascade로 함께 삭제.
export async function DELETE(req, props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'reviews:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  try {
    const r = await prisma.review.delete({ where: { id: params.id }, select: { type: true } });
    revalidateReview(r.type);
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '후기를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  return NextResponse.json({ ok: true });
}
