import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 페이지뷰 기록(공개). 봇/비정상 경로는 제외. 실패해도 무시.
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  let path = (body?.path || '').toString();
  if (!path.startsWith('/')) return NextResponse.json({ ok: false });
  if (path.length > 500) path = path.slice(0, 500);

  const ua = req.headers.get('user-agent') || '';
  if (/bot|crawler|spider|slurp|preview|monitor|headless|lighthouse/i.test(ua)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await prisma.pageView.create({ data: { path } });
  } catch {
    /* 통계 기록 실패는 조용히 무시 */
  }
  return NextResponse.json({ ok: true });
}
