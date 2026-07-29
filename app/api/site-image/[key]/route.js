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
  'Accept-Ranges': 'bytes',
});

// HTTP Range(206) 처리 — <video>가 재생 전 전체 다운로드를 기다리지 않고 조기 재생/시크하도록.
// Range 헤더가 없거나 형식이 아니면 null 반환(호출부가 200 전체 응답으로 처리).
function rangeResponse(buf, mimeType, range) {
  const size = buf.length;
  const m = /^bytes=(\d*)-(\d*)$/.exec(range || '');
  if (!m || (m[1] === '' && m[2] === '')) return null;
  let start = m[1] === '' ? undefined : parseInt(m[1], 10);
  let end = m[2] === '' ? undefined : parseInt(m[2], 10);
  if (start === undefined) { start = size - end; end = size - 1; } // suffix: 마지막 N바이트
  else if (end === undefined) { end = size - 1; }
  if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || start > end || end >= size) {
    return new NextResponse(null, {
      status: 416,
      headers: { 'Content-Range': `bytes */${size}`, 'Accept-Ranges': 'bytes' },
    });
  }
  const chunk = buf.subarray(start, end + 1);
  return new NextResponse(chunk, {
    status: 206,
    headers: {
      ...imgHeaders(mimeType),
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(chunk.length),
    },
  });
}

export async function GET(req, props) {
  const params = await props.params;
  const key = params.key;
  const slot = SITE_IMAGE_SLOTS[key];
  if (!slot) return new NextResponse('Not found', { status: 404 });

  const row = await prisma.siteImage
    .findUnique({ where: { key }, select: { data: true, mimeType: true } })
    .catch(() => null);
  if (row?.data) {
    const data = Buffer.isBuffer(row.data) ? row.data : Buffer.from(row.data);
    const ranged = rangeResponse(data, row.mimeType, req.headers.get('range'));
    if (ranged) return ranged;
    return new NextResponse(data, {
      headers: { ...imgHeaders(row.mimeType), 'Content-Length': String(data.length) },
    });
  }

  // 폴백: public/ 기본 파일
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', slot.default));
    const ext = slot.default.endsWith('.png') ? 'image/png' : 'image/jpeg';
    return new NextResponse(buf, { headers: imgHeaders(ext) });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
