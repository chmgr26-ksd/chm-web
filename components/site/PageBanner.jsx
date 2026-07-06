import { Container } from '@chm/design-system';

/**
 * 내부 페이지 상단 배너 — 쿨 연블루 배경 + eyebrow + 제목 + 설명.
 * @param {string} eyebrow  영문 라벨(예: "ABOUT US")
 * @param {'cta'|'primary'} [tone='primary']  eyebrow 색상
 * @param {React.ReactNode} title
 * @param {string} [description]
 */
export default function PageBanner({ eyebrow, tone = 'primary', title, description }) {
  return (
    <section className="border-b border-border bg-surface-cool">
      <Container size="xl" className="py-16">
        {eyebrow && (
          <div className={`mb-2.5 font-display text-caption font-bold uppercase tracking-[0.14em] ${tone === 'cta' ? 'text-cta' : 'text-primary'}`}>
            {eyebrow}
          </div>
        )}
        <h1 className="text-h1 font-bold leading-tight tracking-tight text-ink-850">{title}</h1>
        {description && (
          <p className="mt-3.5 max-w-2xl text-body-lg leading-normal text-ink-600">{description}</p>
        )}
      </Container>
    </section>
  );
}
