import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 자료 다운로드(공개). 원본 파일명으로 저장되도록 Content-Disposition(attachment) 지정.
// 한글 파일명은 RFC 5987(filename*=UTF-8'')로 인코딩하고, 구형 대비 ASCII 폴백도 함께 제공.
export async function GET(req, props) {
  const params = await props.params;
  const doc = await prisma.resource.findUnique({
    where: { id: params.id },
    select: { data: true, mimeType: true, filename: true, ext: true, published: true },
  });
  if (!doc || !doc.published) return new NextResponse('Not found', { status: 404 });

  const safeName = doc.filename || `자료.${doc.ext}`;
  const asciiFallback = safeName.replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '_') || `file.${doc.ext}`;
  const encoded = encodeURIComponent(safeName);

  return new NextResponse(doc.data, {
    headers: {
      'Content-Type': doc.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`,
      'Content-Length': String(doc.data.length),
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
