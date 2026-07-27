import { Container } from '@chm/design-system';
import PageBanner from '../../../components/site/PageBanner';
import KakaoRoughmap from '@/components/site/KakaoRoughmap';
import { getContact, mapEmbedUrl } from '@/lib/siteContent';

export const metadata = { title: '오시는 길', description: 'CHM Group 위치·연락처·운영 시간 안내. 대전광역시 유성구 유성대로 780 청영빌딩.' };

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
        description="대전 유성구 유성대로 780, 청영빌딩에 있습니다."
      />
      <section className="bg-surface">
        <Container size="xl" className="grid gap-8 py-16 md:grid-cols-[1.4fr_1fr] md:items-start">
          <div className="flex flex-col gap-4">
            {/* 구글 인터랙티브 지도 — 확대·이동 가능 */}
            <div className="overflow-hidden rounded-chm-lg border border-border">
              <iframe
                title={`CHM Group 위치 — ${c.addressDetail}`}
                src={mapEmbedUrl(c.geo || c.address)}
                className="aspect-[16/10] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {/* 카카오 약도 — 로드뷰·길찾기 링크 제공 */}
            <div>
              <div className="mb-2 text-caption font-bold uppercase tracking-wide text-ink-500">
                카카오맵 · 로드뷰 · 길찾기
              </div>
              <div className="overflow-hidden rounded-chm-lg border border-border">
                <KakaoRoughmap height={320} />
              </div>
            </div>
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
