import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';

const MAX_BYTES = 3 * 1024 * 1024; // 3MB

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
  const title = (form.get('title') || '').toString().trim() || null;

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: '이미지 파일을 선택해 주세요.' }, { status: 400 });
  }
  if (!file.type?.startsWith('image/')) {
    return NextResponse.json({ error: '이미지 파일만 업로드할 수 있습니다.' }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: '이미지는 3MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
  }

  await prisma.galleryImage.create({
    data: { title, mimeType: file.type, size: buf.length, data: buf },
  });
  revalidatePath('/gallery');
  return NextResponse.json({ ok: true });
}
