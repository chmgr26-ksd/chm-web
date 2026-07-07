import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { isValidCategory } from '@/lib/posts';

// 소식 작성 — posts:manage(직원·관리자).
export async function POST(req) {
  const session = await auth();
  if (!can(session?.user, 'posts:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const title = (body.title || '').trim();
  const content = (body.body || '').trim();
  const category = body.category;
  const published = body.published !== false;

  if (!title || !content) {
    return NextResponse.json({ error: '제목과 내용을 입력해 주세요.' }, { status: 400 });
  }
  if (!isValidCategory(category)) {
    return NextResponse.json({ error: '카테고리가 올바르지 않습니다.' }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      category, title, body: content, published,
      authorId: session.user.id,
      authorName: session.user.name || null,
    },
  });
  return NextResponse.json({ ok: true, id: post.id });
}
