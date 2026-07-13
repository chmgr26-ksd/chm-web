import { Container } from '@chm/design-system';
import PageBanner from '../../../components/site/PageBanner';
import { getContact, mapEmbedUrl } from '@/lib/siteContent';

export const metadata = { title: '오시는 길', description: 'CHM Group 위치·연락처·운영 시간 안내. 대전광역시 유성구 어은동.' };

export default async function LocationPage() {
  const c = await getContact();
  const cards = [
    { label: '주소', lines: [c.addressDetail] },
    { label: '연락처', lines: [c.phone, c.email] },
    { label: '운영 시간', lines: [c.hours] },
  ];

  return (
    <>
      <PageBanner
        eyebrow="Location"
        title="오시는 길"
        description="대전 유성구, 어은동·궁동 저층 주거지 한가운데에 있습니다."
      />
      <section className="bg-surface">
        <Container size="xl" className="grid gap-8 py-16 md:grid-cols-[1.4fr_1fr] md:items-start">
          <div className="overflow-hidden rounded-chm-lg border border-border">
            <iframe
              title={`CHM Group 위치 — ${c.address}`}
              src={mapEmbedUrl(c.address)}
              className="aspect-[16/10] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="flex flex-col gap-4">
            {cards.map((c) => (
              <div key={c.label} className="rounded-chm-lg border border-border p-6">
                <div className="mb-2 text-caption font-bold uppercase tracking-wide text-ink-500">{c.label}</div>
                {c.lines.map((line) => (
                  <div key={line} className="text-body leading-relaxed text-ink-800">{line}</div>
                ))}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
