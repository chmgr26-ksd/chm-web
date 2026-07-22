'use client';

import { useState } from 'react';
import { Field, Input, Button, Alert } from '@chm/design-system';
import { isBlankHtml } from '@/lib/sanitizeHtml';
import RichTextEditor from '@/components/dashboard/RichTextEditor';

// 공개 QNA '문의하기' 작성 폼 — 이름·연락처·제목·내용(리치 텍스트). POST /api/qna.
export default function QnaForm() {
  const [authorName, setAuthorName] = useState('');
  const [contact, setContact] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [bodyKey, setBodyKey] = useState(0);
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!authorName.trim() || !title.trim() || isBlankHtml(body)) {
      setErr('이름·제목·내용을 입력해 주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName, contact, title, body }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(d.error || '접수 중 오류가 발생했습니다.'); return; }
      setSent(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setErr('네트워크 오류로 접수하지 못했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSent(false); setAuthorName(''); setContact(''); setTitle(''); setBody(''); setBodyKey((k) => k + 1); setErr('');
  };

  if (sent) {
    return (
      <div className="rounded-chm-lg border border-border bg-surface p-8 text-center shadow-chm-sm">
        <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-cooperation-50 text-h2 font-bold text-cooperation-600">✓</span>
        <h2 className="text-h3 font-bold text-ink-850">문의가 접수되었습니다</h2>
        <p className="mt-3 text-body leading-normal text-ink-600">확인 후 답변드리겠습니다. 감사합니다.</p>
        <Button variant="soft" tone="ink" className="mt-6" onClick={reset}>새 문의 작성</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 rounded-chm-lg border border-border bg-surface p-8 shadow-chm-sm" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="이름" required>
          <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="홍길동" />
        </Field>
        <Field label="연락처(선택)" hint="답변 안내를 위한 이메일 또는 전화">
          <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="이메일 또는 010-0000-0000" />
        </Field>
      </div>
      <Field label="제목" required>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="문의 제목" />
      </Field>
      <Field label="내용" required hint="굵게·목록·링크 등 서식을 넣을 수 있습니다">
        <RichTextEditor key={bodyKey} value="" onChange={setBody} placeholder="궁금한 점을 자세히 적어주세요." minHeight={180} />
      </Field>
      {err && <Alert tone="danger">{err}</Alert>}
      <Button type="submit" tone="cta" size="lg" block loading={submitting}>문의하기</Button>
      <p className="text-caption leading-normal text-ink-500">보내주신 정보는 문의 응대 목적으로만 사용됩니다.</p>
    </form>
  );
}
