import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimitByIp } from '@/lib/rateLimit';

// 페이지뷰 기록(공개). 봇/비정상 경로는 제외. 실패해도 무시.
export async function POST(req) {
  // 삽입 폭주 방지 — IP당 분당 60회(정상 탐색은 충분).
  const rl = rateLimitByIp(req, 'track', { max: 60, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false });

  const body = await req.json().catch(() => ({}));
  let path = (body?.path || '').toString();
  if (!path.startsWith('/')) return NextResponse.json({ ok: false });
  if (path.length > 191) path = path.slice(0, 191); // path 컬럼 VARCHAR(191)

  // 유입 경로 — 외부 도메인만 저장(내부 이동·직접 방문은 null).
  let refDomain = null;
  const ref = (body?.referrer || '').toString();
  if (ref) {
    try {
      const u = new URL(ref);
      const host = (req.headers.get('host') || '').split(':')[0];
      if (u.hostname && u.hostname !== host) {
        refDomain = u.hostname.replace(/^www\./, '').slice(0, 191);
      }
    } catch {
      refDomain = null;
    }
  }

  const ua = req.headers.get('user-agent') || '';
  if (/bot|crawler|spider|slurp|preview|monitor|headless|lighthouse/i.test(ua)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await prisma.pageView.create({ data: { path, referrer: refDomain } });
  } catch {
    /* 통계 기록 실패는 조용히 무시 */
  }
  return NextResponse.json({ ok: true });
}
