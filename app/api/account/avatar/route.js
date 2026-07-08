import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { sniffImage } from '@/lib/imageSniff';

const MAX_BYTES = 1024 * 1024; // 1MB (아바타는 작게 리사이즈되어 업로드됨)

// 내 프로필 사진 업로드 — 로그인 회원 본인. multipart/form-data.
export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

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
  const declared = Number(req.headers.get('content-length') || 0);
  if (declared && declared > MAX_BYTES + 4096) {
    return NextResponse.json({ error: '사진은 1MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: '사진은 1MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
  }
  if (!sniffImage(buf)) {
    return NextResponse.json({ error: 'PNG·JPG·WEBP 이미지만 업로드할 수 있습니다.' }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: buf, avatarUpdatedAt: new Date() },
    });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '계정을 찾을 수 없습니다. 다시 로그인해 주세요.' }, { status: 401 });
    throw e;
  }
  return NextResponse.json({ ok: true });
}

// 내 프로필 사진 삭제.
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }
  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: null, avatarUpdatedAt: null },
    });
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: '계정을 찾을 수 없습니다.' }, { status: 401 });
    throw e;
  }
  return NextResponse.json({ ok: true });
}
