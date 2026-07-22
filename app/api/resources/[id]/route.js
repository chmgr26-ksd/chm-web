import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { sanitizeHtml, isBlankHtml } from '@/lib/sanitizeHtml';

const TITLE_MAX = 191;
const DESC_MAX = 8000;

// 자료 메타(제목·설명·공개) 수정 — resources:manage. 파일 교체는 삭제 후 재업로드.
export async function PATCH(req, props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'resources:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const data = {};
  if (body.title !== undefined) {
    const title = body.title.toString().trim();
    if (!title || title.length > TITLE_MAX) return NextResponse.json({ error: '제목을 확인해 주세요.' }, { status: 400 });
    data.title = title;
  }
  if (body.description !== undefined) {
    const raw = body.description.toString();
    data.description = isBlankHtml(raw) ? null : sanitizeHtml(raw, { maxLen: DESC_MAX });
  }
  if (body.published !== undefined) data.published = body.published !== false;

  try {
    await prisma.resource.update({ where: { id: params.id }, data });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '자료를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  revalidatePath('/resources');
  return NextResponse.json({ ok: true });
}

// 자료 삭제 — resources:manage.
export async function DELETE(req, props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'resources:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  try {
    await prisma.resource.delete({ where: { id: params.id } });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '자료를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  revalidatePath('/resources');
  return NextResponse.json({ ok: true });
}
