import { Container, EmptyState, Badge } from '@chm/design-system';
import { prisma } from '@/lib/prisma';
import PageBanner from '../../../components/site/PageBanner';
import { fmtEventRange } from '@/lib/datetime';

// now() 기준으로 예정/지난 행사를 나누므로 동적 렌더(쿼리는 경량).
export const dynamic = 'force-dynamic';
export const metadata = { title: '행사', description: 'CHM Group의 행사·교육·설명회 일정을 안내합니다.' };

function EventCard({ ev, past }) {
  return (
    <article className={`rounded-chm-lg border border-border p-6 ${past ? 'opacity-80' : ''}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge value={past ? 'cooperation' : 'selfreliance'} dot>{past ? '종료' : '예정'}</Badge>
        <span className="text-body-sm font-semibold text-ink-700">{fmtEventRange(ev.startAt, ev.endAt)}</span>
      </div>
      <h3 className="text-h4 font-bold text-ink-850">{ev.title}</h3>
      {ev.location && <div className="mt-1 text-body-sm text-ink-500">장소: {ev.location}</div>}
      <p className="mt-3 whitespace-pre-line text-body-sm leading-relaxed text-ink-700">{ev.description}</p>
    </article>
  );
}

export default async function EventsPage() {
  const now = new Date();
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({ where: { published: true, startAt: { gte: now } }, orderBy: { startAt: 'asc' } }),
    prisma.event.findMany({ where: { published: true, startAt: { lt: now } }, orderBy: { startAt: 'desc' }, take: 30 }),
  ]);

  return (
    <>
      <PageBanner eyebrow="Events" title="행사 안내" description="교육·설명회·나눔 행사 일정을 안내합니다." />
      <section className="bg-surface">
        <Container size="lg" className="py-16">
          {upcoming.length === 0 && past.length === 0 ? (
            <EmptyState title="예정된 행사가 없습니다" description="새로운 행사 소식으로 곧 찾아뵙겠습니다." />
          ) : (
            <div className="flex flex-col gap-10">
              {upcoming.length > 0 && (
                <div>
                  <h2 className="mb-4 text-h3 font-bold text-ink-850">예정된 행사</h2>
                  <div className="flex flex-col gap-4">
                    {upcoming.map((ev) => <EventCard key={ev.id} ev={ev} />)}
                  </div>
                </div>
              )}
              {past.length > 0 && (
                <div>
                  <h2 className="mb-4 text-h3 font-bold text-ink-850">지난 행사</h2>
                  <div className="flex flex-col gap-4">
                    {past.map((ev) => <EventCard key={ev.id} ev={ev} past />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
