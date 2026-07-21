import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { sniffImage } from '@/lib/imageSniff';

const MAX_BYTES = 3 * 1024 * 1024; // 3MB
const MAX_IMAGES = 6; // 후기당 최대 이미지 수(교실 후기 1~6장 기준)
const ROLES = ['PHOTO', 'BEFORE', 'AFTER'];

function revalidateReview(type) {
  revalidatePath(type === 'EXPERIENCE' ? '/reviews/experience' : '/reviews/class');
}

// 후기에 이미지 추가 — reviews:manage. multipart/form-data(file, thumb?, role, sortOrder?).
export async function POST(req, props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'reviews:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const review = await prisma.review.findUnique({
    where: { id: params.id },
    select: { type: true, _count: { select: { images: true } } },
  });
  if (!review) return NextResponse.json({ error: '후기를 찾을 수 없습니다.' }, { status: 404 });
  if (review._count.images >= MAX_IMAGES) {
    return NextResponse.json({ error: `이미지는 최대 ${MAX_IMAGES}장까지 등록할 수 있습니다.` }, { status: 400 });
  }

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
  const file = form.get('file');
  const role = (form.get('role') || 'PHOTO').toString();
  const sortOrder = parseInt(form.get('sortOrder') ?? '0', 10) || 0;
  if (!ROLES.includes(role)) {
    return NextResponse.json({ error: '이미지 역할이 올바르지 않습니다.' }, { status: 400 });
  }
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: '이미지 파일을 선택해 주세요.' }, { status: 400 });
  }

  const declared = Number(req.headers.get('content-length') || 0);
  if (declared && declared > MAX_BYTES + 4096) {
    return NextResponse.json({ error: '이미지는 3MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: '이미지는 3MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
  }
  const mimeType = sniffImage(buf);
  if (!mimeType) {
    return NextResponse.json({ error: 'PNG·JPG·GIF·WEBP 이미지만 업로드할 수 있습니다.' }, { status: 400 });
  }

  // 체험 후기 Before/After는 역할당 1장만 — 기존 같은 역할 이미지가 있으면 교체.
  if (role === 'BEFORE' || role === 'AFTER') {
    await prisma.reviewImage.deleteMany({ where: { reviewId: params.id, role } });
  }

  let thumb = null;
  const thumbFile = form.get('thumb');
  if (thumbFile && typeof thumbFile !== 'string') {
    const tbuf = Buffer.from(await thumbFile.arrayBuffer());
    if (tbuf.length > 0 && tbuf.length <= MAX_BYTES && sniffImage(tbuf)) thumb = tbuf;
  }

  const img = await prisma.reviewImage.create({
    data: { reviewId: params.id, role, sortOrder, mimeType, size: buf.length, data: buf, thumb },
    select: { id: true },
  });
  revalidateReview(review.type);
  return NextResponse.json({ ok: true, id: img.id });
}
