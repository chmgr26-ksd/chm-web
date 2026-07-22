import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { sanitizeHtml, isBlankHtml } from '@/lib/sanitizeHtml';

const ANSWER_MAX = 20000;

// QNA 답변/공개/상태 수정 — qna:manage(직원·관리자).
export async function PATCH(req, props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'qna:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const data = {};
  if (body.answer !== undefined) {
    const raw = body.answer.toString();
    if (isBlankHtml(raw)) {
      data.answer = null;
      data.answered = false;
    } else {
      data.answer = sanitizeHtml(raw, { maxLen: ANSWER_MAX });
      data.answered = true;
    }
  }
  if (body.answered !== undefined) data.answered = body.answered !== false;
  if (body.isPublic !== undefined) data.isPublic = body.isPublic !== false;

  try {
    await prisma.qnaPost.update({ where: { id: params.id }, data });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '문의를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  revalidatePath('/support/qna');
  return NextResponse.json({ ok: true });
}

// QNA 삭제 — qna:manage.
export async function DELETE(req, props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'qna:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  try {
    await prisma.qnaPost.delete({ where: { id: params.id } });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '문의를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  revalidatePath('/support/qna');
  return NextResponse.json({ ok: true });
}
