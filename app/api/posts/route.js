import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { isValidCategory } from '@/lib/posts';
import { sanitizeHtml, isBlankHtml } from '@/lib/sanitizeHtml';

const BODY_MAX = 40000;

// 소식 작성 — posts:manage(직원·관리자).
export async function POST(req) {
  const session = await auth();
  if (!can(session?.user, 'posts:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const title = (body.title || '').trim();
  const rawBody = (body.body || '').toString();
  const category = body.category;
  const published = body.published !== false;

  if (!title || isBlankHtml(rawBody)) {
    return NextResponse.json({ error: '제목과 내용을 입력해 주세요.' }, { status: 400 });
  }
  if (title.length > 191) {
    return NextResponse.json({ error: '제목은 191자 이하여야 합니다.' }, { status: 400 });
  }
  const content = sanitizeHtml(rawBody, { maxLen: BODY_MAX });
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
  revalidatePath('/news/notices');
  revalidatePath('/news/education');
  revalidatePath('/');
  revalidateTag('posts'); // 랜딩 공지 롤러/히어로(getRecentNotices) 캐시 갱신
  return NextResponse.json({ ok: true, id: post.id });
}
