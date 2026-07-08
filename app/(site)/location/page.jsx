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
          <div className="flex aspect-[16/10] items-center justify-center rounded-chm-lg border border-dashed border-ink-300 bg-surface-warm">
            <span className="font-mono text-caption text-ink-500">지도 영역 — 카카오맵/네이버지도 연동 예정</span>
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
