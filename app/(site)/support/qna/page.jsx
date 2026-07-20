import Link from 'next/link';
import { Container, Button } from '@chm/design-system';
import PageBanner from '@/components/site/PageBanner';
import { CONTACT } from '@/components/site/constants';

export const metadata = { title: 'QNA', description: '궁금한 점을 남겨주세요. 확인 후 답변드립니다.' };

// QNA — 공개 질문·답변 게시판(향후 DB·작성폼 연동 예정). 현재는 안내 + 문의 경로 제공.
export default function QnaPage() {
  return (
    <>
      <PageBanner eyebrow="Q&A" title="QNA" description="궁금한 점을 남겨주세요. 확인 후 답변드립니다." />
      <section className="bg-surface">
        <Container size="md" className="py-16">
          <div className="rounded-chm-xl border border-border bg-surface-muted p-8 text-center">
            <h2 className="text-h4 font-bold text-ink-850">온라인 질문·답변 게시판을 준비 중입니다</h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-ink-600">
              게시판 오픈 전까지는 아래 방법으로 문의해 주세요. 자주 묻는 질문은 FAQ에서 먼저 확인하실 수 있습니다.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button as={Link} href="/support/faq" variant="soft" tone="ink">FAQ 보기</Button>
              <Button as={Link} href="/apply" tone="cta">문의 · 신청하기</Button>
              <Button as="a" href={CONTACT.phoneHref} variant="outline" tone="primary">전화 {CONTACT.phone}</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
