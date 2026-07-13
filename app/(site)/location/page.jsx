import { Container } from '@chm/design-system';
import PageBanner from '../../../components/site/PageBanner';
import { CONTACT } from '../../../components/site/constants';

export const metadata = { title: '오시는 길', description: 'CHM Group 위치·연락처·운영 시간 안내. 대전광역시 유성구 어은동.' };

export default function LocationPage() {
  const cards = [
    { label: '주소', lines: [CONTACT.addressDetail] },
    { label: '연락처', lines: [CONTACT.phone, CONTACT.email] },
    { label: '운영 시간', lines: ['평일 09:00 – 18:00', '주말·공휴일 휴무 (긴급 수리는 전화 문의)'] },
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
              title="CHM Group 위치 — 대전광역시 유성구 어은동"
              src="https://maps.google.com/maps?q=%EB%8C%80%EC%A0%84%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%9C%A0%EC%84%B1%EA%B5%AC%20%EC%96%B4%EC%9D%80%EB%8F%99&z=15&hl=ko&output=embed"
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
