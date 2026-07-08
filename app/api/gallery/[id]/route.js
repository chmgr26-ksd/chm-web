import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';

// 이미지 바이너리 서빙(공개). 콘텐츠 해시가 아니므로 짧게 캐시.
export async function GET(req, { params }) {
  const img = await prisma.galleryImage.findUnique({ where: { id: params.id } });
  if (!img) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(img.data, {
    headers: {
      'Content-Type': img.mimeType,
      'Cache-Control': 'public, max-age=86400',
      // 브라우저 MIME 스니핑 차단 + 문서로 렌더되지 않도록(저장형 XSS 방지)
      'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': 'inline',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    },
  });
}

// 이미지 설명(제목) 수정 — gallery:manage.
export async function PATCH(req, { params }) {
  const session = await auth();
  if (!can(session?.user, 'gallery:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  let title = (body.title ?? '').toString().trim() || null;
  if (title && title.length > 191) title = title.slice(0, 191);
  try {
    await prisma.galleryImage.update({ where: { id: params.id }, data: { title } });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '이미지를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  revalidatePath('/gallery');  return NextResponse.json({ ok: true });
}

// 이미지 삭제 — gallery:manage.
export async function DELETE(req, { params }) {
  const session = await auth();
  if (!can(session?.user, 'gallery:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  try {
    await prisma.galleryImage.delete({ where: { id: params.id } });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '이미지를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  revalidatePath('/gallery');  return NextResponse.json({ ok: true });
}
