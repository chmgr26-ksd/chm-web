import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { sanitizeHtml, isBlankHtml } from '@/lib/sanitizeHtml';

const TITLE_MAX = 191;
const BODY_MAX = 40000;
const TYPES = ['CLASS', 'EXPERIENCE'];

// 후기 페이지 캐시 무효화 — 유형별 공개 경로.
function revalidateReview(type) {
  revalidatePath(type === 'EXPERIENCE' ? '/reviews/experience' : '/reviews/class');
}

// 후기 생성 — reviews:manage(직원·관리자). 이미지는 생성 후 별도 업로드.
export async function POST(req) {
  const session = await auth();
  if (!can(session?.user, 'reviews:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const type = (body.type || '').toString();
  const title = (body.title || '').toString().trim();
  const rawBody = (body.body || '').toString();
  let authorName = (body.authorName || '').toString().trim() || null;
  const published = body.published !== false;

  if (!TYPES.includes(type)) {
    return NextResponse.json({ error: '후기 유형이 올바르지 않습니다.' }, { status: 400 });
  }
  if (!title || isBlankHtml(rawBody)) {
    return NextResponse.json({ error: '제목과 내용을 입력해 주세요.' }, { status: 400 });
  }
  const content = sanitizeHtml(rawBody, { maxLen: BODY_MAX });
  if (title.length > TITLE_MAX) {
    return NextResponse.json({ error: '제목이 너무 깁니다.' }, { status: 400 });
  }
  if (authorName && authorName.length > TITLE_MAX) authorName = authorName.slice(0, TITLE_MAX);

  const review = await prisma.review.create({
    data: { type, title, body: content, authorName, published },
  });
  revalidateReview(type);
  return NextResponse.json({ ok: true, id: review.id });
}
