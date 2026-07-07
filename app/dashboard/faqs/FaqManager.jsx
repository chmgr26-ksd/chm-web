'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, Input, Textarea, Button, Badge, Alert } from '@chm/design-system';

function FaqItem({ faq, onChanged }) {
  const [q, setQ] = useState(faq.question);
  const [a, setA] = useState(faq.answer);
  const [busy, setBusy] = useState(false);
  const dirty = q !== faq.question || a !== faq.answer;

  const patch = async (data) => {
    setBusy(true);
    await fetch(`/api/faqs/${faq.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setBusy(false);
    onChanged();
  };
  const del = async () => {
    if (!confirm('이 FAQ를 삭제할까요?')) return;
    setBusy(true);
    await fetch(`/api/faqs/${faq.id}`, { method: 'DELETE' });
    setBusy(false);
    onChanged();
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
      <Field label="질문"><Input value={q} onChange={(e) => setQ(e.target.value)} /></Field>
      <div className="mt-3"><Field label="답변"><Textarea rows={3} value={a} onChange={(e) => setA(e.target.value)} /></Field></div>
      {dirty && <Button size="sm" className="mt-3" onClick={() => patch({ question: q, answer: a })} loading={busy}>저장</Button>}
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
    const res = await fetch('/api/faqs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, answer: a }) });
    setAdding(false);
    if (res.ok) { setQ(''); setA(''); refresh(); }
    else { const d = await res.json().catch(() => ({})); setErr(d.error || '추가에 실패했습니다.'); }
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
