import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 헬스체크 + DB 커넥션 워밍업용. 서버 기동 직후 server.js가 한 번 호출해
// Prisma↔MySQL 연결을 미리 맺어 둔다(첫 대시보드 요청의 콜드 지연 방지).
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
