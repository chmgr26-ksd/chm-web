import { Container, EmptyState } from '@chm/design-system';
import PageBanner from '@/components/site/PageBanner';
import { prisma } from '@/lib/prisma';

export const metadata = { title: '자료실', description: '서식·간행물·안내 자료를 내려받을 수 있습니다.' };
export const dynamic = 'force-dynamic';

function fmtSize(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
function extTone(ext) {
  if (ext === 'pdf') return 'bg-danger-soft text-danger';
  if (ext === 'hwp' || ext === 'hwpx') return 'bg-trust-50 text-trust-700';
  if (ext === 'xls' || ext === 'xlsx') return 'bg-sustainability-50 text-sustainability-700';
  if (ext === 'ppt' || ext === 'pptx') return 'bg-selfreliance-50 text-selfreliance-700';
  return 'bg-ink-100 text-ink-600';
}

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, description: true, filename: true, ext: true, size: true },
  });

  return (
    <>
      <PageBanner eyebrow="Resources" title="자료실" description="서식·간행물·안내 자료를 내려받을 수 있습니다." />
      <section className="bg-surface">
        <Container size="lg" className="py-16">
          {resources.length === 0 ? (
            <EmptyState title="등록된 자료가 없습니다" description="신청 서식·간행물 등 다운로드 자료가 곧 제공됩니다." />
          ) : (
            <ul className="flex flex-col gap-3">
              {resources.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={`/api/resources/${doc.id}/download`}
                    className="group flex items-center gap-4 rounded-chm-lg border border-border bg-surface p-4 transition hover:border-primary hover:bg-surface-warm"
                  >
                    <span className={`grid h-12 w-12 flex-none place-items-center rounded-chm-md text-caption font-bold uppercase ${extTone(doc.ext)}`}>{doc.ext}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-body-lg font-bold text-ink-850 group-hover:text-primary">{doc.title}</div>
                      {doc.description && <p className="mt-0.5 line-clamp-2 text-body-sm text-ink-600">{doc.description}</p>}
                      <div className="mt-1 text-caption text-ink-500">{doc.filename} · {fmtSize(doc.size)}</div>
                    </div>
                    <span className="flex-none rounded-chm-md border border-border px-3 py-2 text-body-sm font-semibold text-ink-700 group-hover:border-primary group-hover:text-primary">내려받기 ↓</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
