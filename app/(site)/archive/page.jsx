import Link from 'next/link';
import { Container, EmptyState, Button } from '@chm/design-system';
import { prisma } from '@/lib/prisma';
import PageBanner from '../../../components/site/PageBanner';
import GalleryGrid from './GalleryGrid';

export const metadata = { title: '활동 아카이브', description: 'CHM Group의 현장과 활동 기록 — 집수리 현장, 교실, 마을 활동 사진 아카이브입니다.' };

const PAGE_SIZE = 12;

export default async function GalleryPage(props) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);

  // 페이지당 이미지 수 제한 → 한 번에 로드되는 /api/archive 요청 수를 줄여 성능 개선.
  const [total, images] = await Promise.all([
    prisma.galleryImage.count(),
    prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageBanner eyebrow="Archive" title="활동 아카이브" description="CHM Group의 현장과 활동 사진 기록입니다." />
      <section className="bg-surface">
        <Container size="xl" className="py-16">
          {images.length === 0 ? (
            <EmptyState
              title={page > 1 ? '이 페이지에는 사진이 없습니다' : '등록된 사진이 없습니다'}
              description={page > 1 ? '범위를 벗어난 페이지입니다.' : '곧 현장 사진으로 찾아뵙겠습니다.'}
              action={page > 1 ? <Button as={Link} href="/archive" variant="soft" tone="ink" size="sm">처음으로</Button> : undefined}
            />
          ) : (
            <>
              <GalleryGrid images={images} />

              {pageCount > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button as={Link} href={`/archive?page=${page - 1}`} variant="soft" tone="ink" size="sm" disabled={page <= 1}>← 이전</Button>
                  <span className="text-body-sm text-ink-600">{page} / {pageCount}</span>
                  <Button as={Link} href={`/archive?page=${page + 1}`} variant="soft" tone="ink" size="sm" disabled={page >= pageCount}>다음 →</Button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}
