'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Field, Input, Textarea, Button, Badge, Alert } from '@chm/design-system';

function FaqItem({ faq, onChanged }) {
  const [q, setQ] = useState(faq.question);
  const [a, setA] = useState(faq.answer);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const dirty = q !== faq.question || a !== faq.answer;

  // 다른 관리자가 수정 후 새 props가 내려오면 로컬 상태를 동기화(수정본 유실 방지).
  useEffect(() => {
    setQ(faq.question);
    setA(faq.answer);
  }, [faq.question, faq.answer]);

  const patch = async (data) => {
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(`/api/faqs/${faq.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErr(d.error || '저장에 실패했습니다.');
        return;
      }
      onChanged();
    } catch {
      setErr('네트워크 오류로 저장하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  };
  const del = async () => {
    if (!confirm('이 FAQ를 삭제할까요?')) return;
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(`/api/faqs/${faq.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErr(d.error || '삭제에 실패했습니다.');
        return;
      }
      onChanged();
    } catch {
      setErr('네트워크 오류로 삭제하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-chm-lg border border-border p-5">
      <div className="mb-3 flex items-center justify-between">
        {faq.published ? <Badge value="cooperation" dot>공개</Badge> : <Badge value="community" dot>비공개</Badge>}
        <div className="flex gap-1.5">
          <Button size="sm" variant="ghost" tone="ink" onClick={() => patch({ published: !faq.published })} disabled={busy}>{faq.published ? '비공개' : '공개'}</Button>
          <Button size="sm" variant="ghost" tone="danger" onClick={del} disabled={busy}>삭제</Button>
        </div>
      </div>
      {err && <div className="mb-3"><Alert tone="danger">{err}</Alert></div>}
      <Field label="질문"><Input value={q} onChange={(e) => setQ(e.target.value)} /></Field>
      <div className="mt-3"><Field label="답변"><Textarea rows={3} value={a} onChange={(e) => setA(e.target.value)} /></Field></div>
      <Button size="sm" tone="primary" className="mt-3" onClick={() => patch({ question: q, answer: a })} loading={busy} disabled={!dirty}>
        {dirty ? '수정 저장' : '저장됨'}
      </Button>
    </div>
  );
}

export default function FaqManager({ initialFaqs }) {
  const router = useRouter();
  const refresh = () => router.refresh();
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [adding, setAdding] = useState(false);
  const [err, setErr] = useState('');

  const add = async (e) => {
    e.preventDefault();
    if (!q.trim() || !a.trim()) { setErr('질문과 답변을 입력해 주세요.'); return; }
    setErr('');
    setAdding(true);
    try {
      const res = await fetch('/api/faqs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, answer: a }) });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErr(d.error || '추가에 실패했습니다.');
        return;
      }
      setQ(''); setA(''); refresh();
    } catch {
      setErr('네트워크 오류로 추가하지 못했습니다.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <form onSubmit={add} className="flex flex-col gap-3 rounded-chm-lg border border-border bg-surface-warm p-5">
        <div className="text-body-sm font-bold text-ink-800">새 FAQ 추가</div>
        {err && <Alert tone="danger">{err}</Alert>}
        <Field label="질문"><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="예: 집수리 신청은 어떻게 하나요?" /></Field>
        <Field label="답변"><Textarea rows={3} value={a} onChange={(e) => setA(e.target.value)} /></Field>
        <div><Button type="submit" size="sm" loading={adding}>추가</Button></div>
      </form>

      {initialFaqs.length === 0 ? (
        <div className="text-body-sm text-ink-500">등록된 FAQ가 없습니다. 위에서 추가해 주세요.</div>
      ) : (
        initialFaqs.map((f) => <FaqItem key={f.id} faq={f} onChanged={refresh} />)
      )}
    </div>
  );
}
