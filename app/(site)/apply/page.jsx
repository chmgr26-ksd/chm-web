'use client';

import { useState } from 'react';
import {
  Container, Button, Field, Input, Textarea, Alert,
} from '@chm/design-system';
import PageBanner from '../../../components/site/PageBanner';
import { APPLY_TYPES, CONTACT } from '../../../components/site/constants';

const PROCESS = [
  { n: 1, text: '담당자 확인 연락 (1일 내)' },
  { n: 2, text: '방문 일정 조율 · 현장 견적' },
  { n: 3, text: '수리 진행 · 결과 확인' },
];

export default function ApplyPage() {
  const [fType, setFType] = useState('repair');
  const [fName, setFName] = useState('');
  const [fPhone, setFPhone] = useState('');
  const [fArea, setFArea] = useState('');
  const [fMsg, setFMsg] = useState('');
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  const [sentName, setSentName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!fName.trim() || !fPhone.trim()) {
      setErr('성함과 연락처는 꼭 입력해 주세요.');
      return;
    }
    setErr('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: fType, name: fName, phone: fPhone, area: fArea, message: fMsg }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitting(false);
        setErr(data.error || '접수 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 전화로 문의해 주세요.');
        return;
      }
    } catch {
      setSubmitting(false);
      setErr('네트워크 오류로 접수하지 못했습니다. 전화로 문의해 주세요.');
      return;
    }
    setSubmitting(false);
    setSentName(fName);
    setSent(true);
    window.scrollTo(0, 0);
  };

  const reset = () => {
    setSent(false); setFType('repair'); setFName(''); setFPhone(''); setFArea(''); setFMsg(''); setErr('');
  };

  return (
    <>
      <PageBanner
        eyebrow="Apply"
        tone="cta"
        title="참여 신청"
        description="집수리 신청, 교육 참가, 자원봉사·협력 제안 모두 이곳에서 받습니다."
      />
      <section className="bg-surface">
        <Container size="xl" className="grid gap-8 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-start">
          {/* ── 좌: 폼 / 성공 ── */}
          <div className="rounded-chm-lg border border-border bg-surface p-8 shadow-chm-sm">
            {sent ? (
              <div className="py-8 text-center">
                <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-cooperation-50 text-h2 font-bold text-cooperation-600">✓</span>
                <h2 className="text-h3 font-bold text-ink-850">신청이 접수되었습니다</h2>
                <p className="mt-3 text-body leading-normal text-ink-600">
                  <strong className="text-ink-850">{sentName}</strong>님, 감사합니다.<br />
                  영업일 기준 1일 내에 담당자가 연락드리겠습니다.
                </p>
                <Button variant="soft" tone="ink" className="mt-6" onClick={reset}>새 신청 작성</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
                <Field label="신청 유형">
                  <div className="flex flex-wrap gap-2.5">
                    {APPLY_TYPES.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setFType(t.key)}
                        className={`rounded-chm-md border px-4 py-2.5 text-body-sm font-semibold transition-colors ${
                          fType === t.key
                            ? 'border-ink-850 bg-ink-850 text-white'
                            : 'border-border bg-surface text-ink-700 hover:border-ink-300'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="성함" required>
                    <Input value={fName} onChange={(e) => setFName(e.target.value)} placeholder="홍길동" />
                  </Field>
                  <Field label="연락처" required>
                    <Input value={fPhone} onChange={(e) => setFPhone(e.target.value)} placeholder="010-0000-0000" inputMode="tel" />
                  </Field>
                </div>

                <Field label="거주 지역 (동)">
                  <Input value={fArea} onChange={(e) => setFArea(e.target.value)} placeholder="예: 어은동" />
                </Field>

                <Field label="내용">
                  <Textarea value={fMsg} onChange={(e) => setFMsg(e.target.value)} rows={4} placeholder="필요한 수리 내용이나 문의 사항을 자유롭게 적어주세요." />
                </Field>

                {err && <Alert tone="danger">{err}</Alert>}

                <Button type="submit" tone="cta" size="lg" block loading={submitting}>신청서 보내기</Button>
                <p className="text-caption leading-normal text-ink-500">보내주신 정보는 신청 응대 목적으로만 사용됩니다. 접수 후 영업일 기준 1일 내에 연락드립니다.</p>
              </form>
            )}
          </div>

          {/* ── 우: 전화 신청 / 진행 순서 / 봉사 ── */}
          <div className="flex flex-col gap-5">
            <div className="rounded-chm-lg bg-surface-dark p-7 text-white">
              <div className="text-body-sm font-semibold text-ink-300">전화로도 신청할 수 있어요</div>
              <a href={CONTACT.phoneHref} className="mt-1.5 block font-display text-h2 font-extrabold tracking-tight text-white">{CONTACT.phone}</a>
              <div className="mt-2 text-body-sm text-ink-300">평일 09:00 – 18:00 · 대표 {CONTACT.rep}</div>
            </div>

            <div className="rounded-chm-lg border border-border p-7">
              <div className="mb-4 text-body-lg font-bold text-ink-850">접수 후 진행 순서</div>
              <ol className="flex flex-col gap-3.5">
                {PROCESS.map((p) => (
                  <li key={p.n} className="flex items-start gap-3">
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-primary text-caption font-bold text-white">{p.n}</span>
                    <span className="text-body-sm leading-snug text-ink-700">{p.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-chm-lg border border-border bg-surface-warm p-7">
              <div className="mb-1.5 text-body font-bold text-ink-850">봉사·협력 문의도 환영합니다</div>
              <p className="text-body-sm leading-normal text-ink-600">기업·기관의 사회공헌 연계, 자원봉사 참여 모두 위 양식에서 ‘자원봉사·협력’을 선택해 주세요.</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
