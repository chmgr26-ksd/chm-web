import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';

// 이미지 바이너리 서빙(공개). ?v=thumb 이면 썸네일 우선.
const imgHeaders = (type) => ({
  'Content-Type': type,
  'Cache-Control': 'public, max-age=86400',
  'X-Content-Type-Options': 'nosniff',
  'Content-Disposition': 'inline',
  'Content-Security-Policy': "default-src 'none'; sandbox",
});

function revalidateReview(type) {
  revalidatePath(type === 'EXPERIENCE' ? '/reviews/experience' : '/reviews/class');
}

export async function GET(req, props) {
  const params = await props.params;
  const wantThumb = new URL(req.url).searchParams.get('v') === 'thumb';

  if (wantThumb) {
    const t = await prisma.reviewImage.findUnique({ where: { id: params.imageId }, select: { thumb: true } });
    if (t?.thumb) return new NextResponse(t.thumb, { headers: imgHeaders('image/jpeg') });
  }
  const img = await prisma.reviewImage.findUnique({
    where: { id: params.imageId },
    select: { data: true, mimeType: true },
  });
  if (!img) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(img.data, { headers: imgHeaders(img.mimeType) });
}

// 정렬 순서 변경 — reviews:manage.
export async function PATCH(req, props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'reviews:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const data = {};
  if (body.sortOrder !== undefined) data.sortOrder = parseInt(body.sortOrder, 10) || 0;
  if (Object.keys(data).length === 0) return NextResponse.json({ ok: true });
  try {
    const img = await prisma.reviewImage.update({
      where: { id: params.imageId },
      data,
      select: { review: { select: { type: true } } },
    });
    revalidateReview(img.review.type);
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '이미지를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  return NextResponse.json({ ok: true });
}

// 이미지 삭제 — reviews:manage.
export async function DELETE(req, props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'reviews:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  try {
    const img = await prisma.reviewImage.delete({
      where: { id: params.imageId },
      select: { review: { select: { type: true } } },
    });
    revalidateReview(img.review.type);
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '이미지를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  return NextResponse.json({ ok: true });
}
