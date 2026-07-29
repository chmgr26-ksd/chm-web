import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { sniffImage, sniffVideo } from '@/lib/imageSniff';
import { SITE_IMAGE_SLOTS } from '@/lib/siteContent';

// 사이트 이미지 교체/되돌리기 — settings:manage(관리자) 전용.
const IMAGE_MAX = 8 * 1024 * 1024;   // 정적 이미지 원본 상한(리사이즈 전)
const MOTION_MAX = 12 * 1024 * 1024; // 모션 GIF·영상 상한(원본 보존 저장 · DB blob)

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
  const imgType = sniffImage(raw);
  const vidType = slot.motion ? sniffVideo(raw) : null;
  // 모션 슬롯의 GIF는 애니메이션 보존을 위해 JPEG 변환 없이 원본 저장.
  const keepRaw = vidType || (slot.motion && imgType === 'image/gif');

  if (!imgType && !vidType) {
    return NextResponse.json(
      { error: slot.motion ? 'PNG·JPG·GIF·WEBP 이미지 또는 mp4·webm 영상만 업로드할 수 있습니다.' : 'PNG·JPG·GIF·WEBP 이미지만 업로드할 수 있습니다.' },
      { status: 400 },
    );
  }
  const cap = keepRaw ? MOTION_MAX : IMAGE_MAX;
  if (raw.length > cap) {
    return NextResponse.json(
      { error: keepRaw ? '모션 GIF·영상은 12MB 이하만 업로드할 수 있습니다.' : '이미지는 8MB 이하만 업로드할 수 있습니다.' },
      { status: 400 },
    );
  }

  let data;
  let mimeType;
  if (keepRaw) {
    // 영상·모션 GIF: 원본 바이트 그대로 저장(재인코딩 없음).
    data = raw;
    mimeType = vidType || 'image/gif';
  } else {
    // 정적 이미지: 서버 리사이즈 — 최장변 1920px, JPEG q85(mozjpeg). 저장 blob 경량화.
    try {
      data = await sharp(raw)
        .rotate()
        .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, mozjpeg: true, progressive: true })
        .toBuffer();
    } catch {
      return NextResponse.json({ error: '이미지를 처리하지 못했습니다.' }, { status: 400 });
    }
    mimeType = 'image/jpeg';
  }

  await prisma.siteImage.upsert({
    where: { key },
    update: { mimeType, size: data.length, data },
    create: { key, mimeType, size: data.length, data },
  });

  // 영상 슬롯의 포스터(첫 프레임) 동기화 — 로딩 중 빈 화면 방지.
  // 영상이면 클라이언트가 캡처해 보낸 poster(jpg)를 저장, 아니면 stale 포스터 제거.
  if (slot.motion) {
    const posterKey = `${key}-poster`;
    const poster = vidType ? form.get('poster') : null;
    if (poster && typeof poster !== 'string') {
      const praw = Buffer.from(await poster.arrayBuffer());
      if (sniffImage(praw) && praw.length <= IMAGE_MAX) {
        try {
          const pdata = await sharp(praw)
            .rotate()
            .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 82, mozjpeg: true, progressive: true })
            .toBuffer();
          await prisma.siteImage.upsert({
            where: { key: posterKey },
            update: { mimeType: 'image/jpeg', size: pdata.length, data: pdata },
            create: { key: posterKey, mimeType: 'image/jpeg', size: pdata.length, data: pdata },
          });
        } catch {
          // 포스터 실패는 치명적이지 않음 — 영상 저장은 이미 성공.
        }
      }
    } else {
      // 정적 이미지/모션GIF로 교체 → 이전 영상 포스터 제거.
      await prisma.siteImage.deleteMany({ where: { key: posterKey } });
    }
  }

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
  // 영상 슬롯이면 포스터도 함께 제거.
  await prisma.siteImage.deleteMany({ where: { key: { in: [key, `${key}-poster`] } } });
  revalidateTag('site-images');
  revalidatePath(slot.page);
  return NextResponse.json({ ok: true });
}
