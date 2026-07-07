import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { isValidCategory } from '@/lib/posts';

// 소식 수정 — posts:manage. 부분 갱신(발행 토글 포함).
export async function PATCH(req, { params }) {
  const session = await auth();
  if (!can(session?.user, 'posts:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const data = {};
  if (typeof body.title === 'string') {
    if (!body.title.trim()) return NextResponse.json({ error: '제목을 입력해 주세요.' }, { status: 400 });
    data.title = body.title.trim();
  }
  if (typeof body.body === 'string') {
    if (!body.body.trim()) return NextResponse.json({ error: '내용을 입력해 주세요.' }, { status: 400 });
    data.body = body.body.trim();
  }
  if (body.category !== undefined) {
    if (!isValidCategory(body.category)) return NextResponse.json({ error: '카테고리가 올바르지 않습니다.' }, { status: 400 });
    data.category = body.category;
  }
  if (typeof body.published === 'boolean') data.published = body.published;

  try {
    await prisma.post.update({ where: { id: params.id }, data });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  return NextResponse.json({ ok: true });
}

// 소식 삭제 — posts:manage.
export async function DELETE(req, { params }) {
  const session = await auth();
  if (!can(session?.user, 'posts:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  try {
    await prisma.post.delete({ where: { id: params.id } });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  return NextResponse.json({ ok: true });
}
