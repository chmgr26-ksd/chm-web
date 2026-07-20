import { Container, Button } from '@chm/design-system';
import PageBanner from '@/components/site/PageBanner';
import { REVIEW_FORM_URL } from '@/components/site/constants';

export const metadata = { title: '집수리 교실 후기', description: '집수리 교실 참가자들의 생생한 후기입니다.' };

// 집수리 교실 후기 — 골격(향후 후기 데이터 연동). 후기 모집은 구글 폼으로.
export default function ClassReviewsPage() {
  return (
    <>
      <PageBanner eyebrow="Reviews" title="집수리 교실 후기" description="집수리 교실 참가자들의 생생한 후기입니다." />
      <section className="bg-surface">
        <Container size="md" className="py-16">
          <div className="rounded-chm-xl border border-border bg-surface-muted p-8 text-center">
            <h2 className="text-h4 font-bold text-ink-850">후기를 모으고 있습니다</h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-ink-600">
              집수리 교실에 참여하셨다면 소중한 후기를 남겨주세요. 등록된 후기는 이 페이지에 순차적으로 소개됩니다.
            </p>
            <div className="mt-6">
              <Button as="a" href={REVIEW_FORM_URL} target="_blank" rel="noopener noreferrer" tone="cta">
                후기 남기기 (구글 폼) ↗
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
