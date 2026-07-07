import { Container, Accordion, AccordionItem, EmptyState } from '@chm/design-system';
import { prisma } from '@/lib/prisma';
import PageBanner from '../../../components/site/PageBanner';

export const dynamic = 'force-dynamic';
export const metadata = { title: '자주 묻는 질문 · CHM Group' };

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({ where: { published: true }, orderBy: { createdAt: 'asc' } });

  return (
    <>
      <PageBanner eyebrow="FAQ" title="자주 묻는 질문" description="궁금한 점을 빠르게 확인하세요." />
      <section className="bg-surface">
        <Container size="md" className="py-16">
          {faqs.length === 0 ? (
            <EmptyState title="등록된 질문이 없습니다" description="문의사항은 참여 신청 또는 전화로 연락해 주세요." />
          ) : (
            <Accordion>
              {faqs.map((f, i) => (
                <AccordionItem key={f.id} title={f.question} defaultOpen={i === 0}>
                  <p className="whitespace-pre-line leading-relaxed text-ink-700">{f.answer}</p>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Container>
      </section>
    </>
  );
}
