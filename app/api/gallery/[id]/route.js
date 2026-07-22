import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { sanitizeHtml, isBlankHtml } from '@/lib/sanitizeHtml';

// 이미지 바이너리 서빙(공개). 콘텐츠 해시가 아니므로 짧게 캐시.
// ?v=thumb 이면 썸네일(있을 때)만 로드해 서빙 → 그리드 트래픽 경량화.
const imgHeaders = (type) => ({
  'Content-Type': type,
  'Cache-Control': 'public, max-age=86400',
  // 브라우저 MIME 스니핑 차단 + 문서로 렌더되지 않도록(저장형 XSS 방지)
  'X-Content-Type-Options': 'nosniff',
  'Content-Disposition': 'inline',
  'Content-Security-Policy': "default-src 'none'; sandbox",
});

export async function GET(req, props) {
  const params = await props.params;
  const wantThumb = new URL(req.url).searchParams.get('v') === 'thumb';

  if (wantThumb) {
    // 원본(data)을 로드하지 않고 썸네일만 조회 → 트래픽·메모리 절감.
    const t = await prisma.galleryImage.findUnique({ where: { id: params.id }, select: { thumb: true } });
    if (t?.thumb) return new NextResponse(t.thumb, { headers: imgHeaders('image/jpeg') });
    // 썸네일이 없는 기존 이미지는 아래에서 원본으로 폴백.
  }

  const img = await prisma.galleryImage.findUnique({
    where: { id: params.id },
    select: { data: true, mimeType: true },
  });
  if (!img) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(img.data, { headers: imgHeaders(img.mimeType) });
}

// 이미지 설명(제목) 수정 — gallery:manage.
export async function PATCH(req, props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'gallery:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const data = {};
  if (body.title !== undefined) {
    let title = (body.title ?? '').toString().trim() || null;
    if (title && title.length > 191) title = title.slice(0, 191);
    data.title = title;
  }
  if (body.description !== undefined) {
    const raw = (body.description ?? '').toString();
    data.description = isBlankHtml(raw) ? null : sanitizeHtml(raw);
  }
  try {
    await prisma.galleryImage.update({ where: { id: params.id }, data });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '이미지를 찾을 수 없습니다.' }, { status: 404 });
    throw e;
  }
  revalidatePath('/archive');return NextResponse.json({ ok: true });
}

// 이미지 삭제 — gallery:manage.
export async function DELETE(req, props) {
  const params = await props.params;
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
  revalidatePath('/archive');return NextResponse.json({ ok: true });
}
