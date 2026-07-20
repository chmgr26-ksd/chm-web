import Link from 'next/link';
import { Container, Button } from '@chm/design-system';
import PageBanner from '@/components/site/PageBanner';

export const metadata = { title: '자료실', description: '서식·간행물·안내 자료를 내려받을 수 있습니다.' };

// 자료실 — 골격(향후 자료 업로드·다운로드 연동 예정).
export default function ResourcesPage() {
  return (
    <>
      <PageBanner eyebrow="Resources" title="자료실" description="서식·간행물·안내 자료를 제공합니다." />
      <section className="bg-surface">
        <Container size="md" className="py-16">
          <div className="rounded-chm-xl border border-border bg-surface-muted p-8 text-center">
            <h2 className="text-h4 font-bold text-ink-850">자료를 준비하고 있습니다</h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-ink-600">
              신청 서식, 사업 안내 간행물 등 다운로드 자료가 곧 제공됩니다. 급히 필요하신 자료는 문의로 요청해 주세요.
            </p>
            <div className="mt-6">
              <Button as={Link} href="/apply" tone="cta">자료 요청 · 문의</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
