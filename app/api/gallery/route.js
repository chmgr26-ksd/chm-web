import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { sniffImage } from '@/lib/imageSniff';
import { sanitizeHtml, isBlankHtml } from '@/lib/sanitizeHtml';

const MAX_BYTES = 3 * 1024 * 1024; // 3MB
const TITLE_MAX = 191; // title 컬럼 VARCHAR(191)

// 이미지 업로드 — gallery:manage(직원·관리자). multipart/form-data.
export async function POST(req) {
  const session = await auth();
  if (!can(session?.user, 'gallery:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
  const file = form.get('file');
  let title = (form.get('title') || '').toString().trim() || null;
  if (title && title.length > TITLE_MAX) title = title.slice(0, TITLE_MAX);
  const rawDesc = (form.get('description') || '').toString();
  const description = isBlankHtml(rawDesc) ? null : sanitizeHtml(rawDesc);

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: '이미지 파일을 선택해 주세요.' }, { status: 400 });
  }
  // 대용량 바디를 통째로 버퍼링하기 전에 Content-Length로 1차 차단.
  const declared = Number(req.headers.get('content-length') || 0);
  if (declared && declared > MAX_BYTES + 4096) {
    return NextResponse.json({ error: '이미지는 3MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: '이미지는 3MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
  }
  // 실제 바이트로 이미지 종류 판별 — PNG/JPEG/GIF/WEBP만 허용, SVG 등 거부.
  const mimeType = sniffImage(buf);
  if (!mimeType) {
    return NextResponse.json({ error: 'PNG·JPG·GIF·WEBP 이미지만 업로드할 수 있습니다.' }, { status: 400 });
  }

  // 클라이언트가 생성한 그리드용 썸네일(선택) — 실제 이미지 바이트인지 검증 후 저장.
  let thumb = null;
  const thumbFile = form.get('thumb');
  if (thumbFile && typeof thumbFile !== 'string') {
    const tbuf = Buffer.from(await thumbFile.arrayBuffer());
    if (tbuf.length > 0 && tbuf.length <= MAX_BYTES && sniffImage(tbuf)) thumb = tbuf;
  }

  await prisma.galleryImage.create({
    data: { title, description, mimeType, size: buf.length, data: buf, thumb },
  });
  revalidatePath('/archive');
  return NextResponse.json({ ok: true });
}
