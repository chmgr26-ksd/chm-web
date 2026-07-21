import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { sniffDocument, ALLOWED_LABEL } from '@/lib/fileSniff';

const MAX_BYTES = 20 * 1024 * 1024; // 20MB
const TITLE_MAX = 191;
const DESC_MAX = 2000;

// 자료실 문서 업로드 — resources:manage(직원·관리자). multipart/form-data(file, title, description?, published?).
export async function POST(req) {
  const session = await auth();
  if (!can(session?.user, 'resources:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
  const file = form.get('file');
  let title = (form.get('title') || '').toString().trim();
  let description = (form.get('description') || '').toString().trim() || null;
  const published = form.get('published') !== 'false';

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: '문서 파일을 선택해 주세요.' }, { status: 400 });
  }
  if (!title) title = (file.name || '자료').replace(/\.[a-z0-9]+$/i, '').slice(0, TITLE_MAX);
  if (title.length > TITLE_MAX) title = title.slice(0, TITLE_MAX);
  if (description && description.length > DESC_MAX) description = description.slice(0, DESC_MAX);

  const declared = Number(req.headers.get('content-length') || 0);
  if (declared && declared > MAX_BYTES + 4096) {
    return NextResponse.json({ error: '문서는 20MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length === 0) {
    return NextResponse.json({ error: '빈 파일입니다.' }, { status: 400 });
  }
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: '문서는 20MB 이하만 업로드할 수 있습니다.' }, { status: 400 });
  }

  const sniff = sniffDocument(file.name, buf);
  if (!sniff) {
    return NextResponse.json({ error: `${ALLOWED_LABEL} 형식의 문서만 업로드할 수 있습니다.` }, { status: 400 });
  }

  const filename = (file.name || `자료.${sniff.ext}`).toString().slice(0, TITLE_MAX);
  const doc = await prisma.resource.create({
    data: { title, description, filename, ext: sniff.ext, mimeType: sniff.mime, size: buf.length, data: buf, published },
    select: { id: true },
  });
  revalidatePath('/resources');
  return NextResponse.json({ ok: true, id: doc.id });
}
