import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import { SITE_IMAGE_SLOTS } from '@/lib/siteContent';

// 공개 사이트 이미지 서빙 — DB(SiteImage) 있으면 그것, 없으면 public/ 기본 파일로 폴백.
// 편집 시 페이지가 ?v=<updatedAt>을 바꿔 참조하므로 콘텐츠는 길게 캐시해도 안전.
const imgHeaders = (type) => ({
  'Content-Type': type,
  'Cache-Control': 'public, max-age=86400',
  'X-Content-Type-Options': 'nosniff',
  'Content-Disposition': 'inline',
});

export async function GET(req, props) {
  const params = await props.params;
  const key = params.key;
  const slot = SITE_IMAGE_SLOTS[key];
  if (!slot) return new NextResponse('Not found', { status: 404 });

  const row = await prisma.siteImage
    .findUnique({ where: { key }, select: { data: true, mimeType: true } })
    .catch(() => null);
  if (row?.data) return new NextResponse(row.data, { headers: imgHeaders(row.mimeType) });

  // 폴백: public/ 기본 파일
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', slot.default));
    const ext = slot.default.endsWith('.png') ? 'image/png' : 'image/jpeg';
    return new NextResponse(buf, { headers: imgHeaders(ext) });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
