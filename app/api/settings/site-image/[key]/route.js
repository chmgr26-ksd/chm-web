import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { sniffImage } from '@/lib/imageSniff';
import { SITE_IMAGE_SLOTS } from '@/lib/siteContent';

// 사이트 이미지 교체/되돌리기 — settings:manage(관리자) 전용.
const MAX_BYTES = 8 * 1024 * 1024; // 업로드 원본 상한(리사이즈 전)

export async function POST(req, props) {
  const params = await props.params;
  const key = params.key;
  const slot = SITE_IMAGE_SLOTS[key];
  const session = await auth();
  if (!can(session?.user, 'settings:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  if (!slot) return NextResponse.json({ error: '알 수 없는 이미지 슬롯입니다.' }, { status: 404 });

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
  const file = form.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: '이미지 파일을 선택해 주세요.' }, { status: 400 });
  }
  const raw = Buffer.from(await file.arrayBuffer());
  if (raw.length > MAX_BYTES) {
    return NextResponse.json({ error: '이미지는 8MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
  }
  if (!sniffImage(raw)) {
    return NextResponse.json({ error: 'PNG·JPG·GIF·WEBP 이미지만 업로드할 수 있습니다.' }, { status: 400 });
  }

  // 서버 리사이즈 — 최장변 1920px, JPEG q85(mozjpeg). 저장 blob 경량화.
  let data;
  try {
    data = await sharp(raw)
      .rotate()
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true, progressive: true })
      .toBuffer();
  } catch {
    return NextResponse.json({ error: '이미지를 처리하지 못했습니다.' }, { status: 400 });
  }

  await prisma.siteImage.upsert({
    where: { key },
    update: { mimeType: 'image/jpeg', size: data.length, data },
    create: { key, mimeType: 'image/jpeg', size: data.length, data },
  });
  revalidateTag('site-images');
  revalidatePath(slot.page);
  return NextResponse.json({ ok: true });
}

// 기본 이미지로 되돌리기 — DB 행 삭제.
export async function DELETE(req, props) {
  const params = await props.params;
  const key = params.key;
  const slot = SITE_IMAGE_SLOTS[key];
  const session = await auth();
  if (!can(session?.user, 'settings:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  if (!slot) return NextResponse.json({ error: '알 수 없는 이미지 슬롯입니다.' }, { status: 404 });
  await prisma.siteImage.deleteMany({ where: { key } });
  revalidateTag('site-images');
  revalidatePath(slot.page);
  return NextResponse.json({ ok: true });
}
