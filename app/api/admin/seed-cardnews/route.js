import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'node:fs';
import path from 'node:path';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';

// [임시] 관리자 시드 엔드포인트 — 집수리교실 카드뉴스 현장사진 14장을 갤러리에 일괄 삽입.
// public/_seed/cardnews/ 의 미리 렌더된 원본+썸네일(manifest.json 기준)을 읽어 넣음.
// - gallery:manage 권한 전용 (직원·관리자)
// - 멱등: 기존 '구즉동 집수리교실 ' 접두 항목을 지우고 다시 삽입 → 여러 번 호출해도 항상 14장
// - Passenger 런타임에서 실행되므로 Prisma가 정상 동작(CLI 엔진 패닉 회피).
// 시딩 완료·검증 후 이 라우트와 public/_seed 는 정리 커밋으로 제거한다.
const SEED_DIR = path.join(process.cwd(), 'public', '_seed', 'cardnews');

export async function POST() {
  const session = await auth();
  if (!can(session?.user, 'gallery:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'manifest.json'), 'utf8'));
  } catch (e) {
    return NextResponse.json({ error: '시드 에셋을 찾을 수 없습니다.', detail: String(e?.message || e) }, { status: 500 });
  }

  const removed = await prisma.galleryImage.deleteMany({
    where: { title: { startsWith: '구즉동 집수리교실 ' } },
  });

  let inserted = 0;
  for (const m of manifest) {
    const data = fs.readFileSync(path.join(SEED_DIR, m.main));
    const thumb = fs.readFileSync(path.join(SEED_DIR, m.thumb));
    await prisma.galleryImage.create({
      data: {
        title: m.title,
        mimeType: 'image/jpeg',
        size: data.length,
        data,
        thumb,
        createdAt: new Date(m.createdAt),
      },
    });
    inserted += 1;
  }

  revalidatePath('/gallery');
  const total = await prisma.galleryImage.count();
  return NextResponse.json({ ok: true, removed: removed.count, inserted, total });
}
