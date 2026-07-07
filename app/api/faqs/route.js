import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';

// FAQ 작성 — faqs:manage(직원·관리자).
export async function POST(req) {
  const session = await auth();
  if (!can(session?.user, 'faqs:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const question = (body.question || '').trim();
  const answer = (body.answer || '').trim();
  if (!question || !answer) {
    return NextResponse.json({ error: '질문과 답변을 입력해 주세요.' }, { status: 400 });
  }
  const faq = await prisma.faq.create({ data: { question, answer, published: body.published !== false } });
  revalidatePath('/faq');
  return NextResponse.json({ ok: true, id: faq.id });
}
