import { Container, EmptyState } from '@chm/design-system';
import { prisma } from '@/lib/prisma';
import PageBanner from '../../../components/site/PageBanner';

export const dynamic = 'force-dynamic';
export const metadata = { title: '갤러리 · CHM Group' };

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  });

  return (
    <>
      <PageBanner eyebrow="Gallery" title="갤러리" description="CHM Group의 현장과 활동 사진입니다." />
      <section className="bg-surface">
        <Container size="xl" className="py-16">
          {images.length === 0 ? (
            <EmptyState title="등록된 사진이 없습니다" description="곧 현장 사진으로 찾아뵙겠습니다." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((img) => (
                <figure key={img.id} className="overflow-hidden rounded-chm-lg border border-border">
                  <img
                    src={`/api/gallery/${img.id}`}
                    alt={img.title || 'CHM Group 갤러리 이미지'}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {img.title && <figcaption className="px-3 py-2 text-caption text-ink-600">{img.title}</figcaption>}
                </figure>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
