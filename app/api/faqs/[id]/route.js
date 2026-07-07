import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';

export async function PATCH(req, { params }) {
  const session = await auth();
  if (!can(session?.user, 'faqs:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const data = {};
  if (typeof body.question === 'string') {
    if (!body.question.trim()) return NextResponse.json({ error: '질문을 입력해 주세요.' }, { status: 400 });
    data.question = body.question.trim();
  }
  if (typeof body.answer === 'string') {
    if (!body.answer.trim()) return NextResponse.json({ error: '답변을 입력해 주세요.' }, { status: 400 });
    data.answer = body.answer.trim();
  }
  if (typeof body.published === 'boolean') data.published = body.published;

  try {
    await prisma.faq.update({ where: { id: params.id }, data });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'FAQ를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  revalidatePath('/faq');  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const session = await auth();
  if (!can(session?.user, 'faqs:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  try {
    await prisma.faq.delete({ where: { id: params.id } });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'FAQ를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  revalidatePath('/faq');  return NextResponse.json({ ok: true });
}
