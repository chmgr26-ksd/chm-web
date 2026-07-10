import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sniffImage } from '@/lib/imageSniff';

// 프로필 사진 서빙(공개). 없으면 404 → UI는 이니셜로 폴백.
export async function GET(req, props) {
  const params = await props.params;
  const u = await prisma.user.findUnique({
    where: { id: params.id },
    select: { avatar: true },
  });
  if (!u?.avatar) return new NextResponse('Not found', { status: 404 });
  const mime = sniffImage(u.avatar) || 'image/jpeg';
  return new NextResponse(u.avatar, {
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=86400',
      // 사용자 업로드 이미지 — MIME 스니핑 차단 + 문서 렌더 방지(저장형 XSS 방지)
      'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': 'inline',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    },
  });
}
