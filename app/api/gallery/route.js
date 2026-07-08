import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';

const MAX_BYTES = 3 * 1024 * 1024; // 3MB
const TITLE_MAX = 191; // title 컬럼 VARCHAR(191)

// 래스터 이미지만 허용(SVG 등 스크립트 실행 가능 포맷 제외 → 저장형 XSS 차단).
// 신뢰할 수 없는 file.type 대신 실제 바이트(매직 넘버)로 판별한다.
function sniffImage(buf) {
  if (buf.length < 12) return null;
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  // GIF: "GIF8"
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return 'image/gif';
  // WEBP: "RIFF"...."WEBP"
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp';
  return null;
}

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

  await prisma.galleryImage.create({
    data: { title, mimeType, size: buf.length, data: buf },
  });
  revalidatePath('/gallery');
  return NextResponse.json({ ok: true });
}
