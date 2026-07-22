'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Switch, Button, Alert } from '@chm/design-system';
import RichText from '@/components/site/RichText';
import RichTextEditor from '@/components/dashboard/RichTextEditor';

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())} ${p(dt.getHours())}:${p(dt.getMinutes())}`;
}

function QnaItem({ post, onChanged }) {
  const [answer, setAnswer] = useState(post.answer || '');
  const [isPublic, setIsPublic] = useState(post.isPublic);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const answerDirty = answer !== (post.answer || '');

  const patch = async (payload, okText) => {
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`/api/qna/${post.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '처리 실패' }); return false; }
      if (okText) setMsg({ tone: 'success', text: okText });
      onChanged();
      return true;
    } finally { setBusy(false); }
  };

  const saveAnswer = () => patch({ answer }, '답변을 저장했습니다.');
  const togglePublic = async (next) => {
    setIsPublic(next); // 낙관적
    const ok = await patch({ isPublic: next });
    if (!ok) setIsPublic(!next);
  };
  const remove = async () => {
    if (!confirm('이 문의를 삭제할까요? 되돌릴 수 없습니다.')) return;
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`/api/qna/${post.id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setMsg({ tone: 'danger', text: d.error || '삭제 실패' }); return; }
      onChanged();
    } finally { setBusy(false); }
  };

  return (
    <div className="flex flex-col gap-3 rounded-chm-lg border border-border bg-surface p-5">
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-body-lg font-bold text-ink-850">{post.title}</h3>
          {post.answered ? <Badge value="cooperation" dot>답변완료</Badge> : <Badge value="selfreliance" dot>미답변</Badge>}
          {post.isPublic && <Badge value="trust">공개</Badge>}
        </div>
        <span className="text-caption text-ink-500">{post.authorName}{post.contact ? ` · ${post.contact}` : ''} · {fmtDate(post.createdAt)}</span>
      </div>

      <div className="rounded-chm-md border border-border bg-surface-warm p-3">
        <div className="mb-1 text-caption font-semibold text-ink-500">문의 내용</div>
        <RichText html={post.body} className="text-body-sm text-ink-700" />
      </div>

      <div>
        <div className="mb-1 text-caption font-semibold text-ink-600">답변</div>
        <RichTextEditor value={post.answer || ''} onChange={setAnswer} placeholder="답변을 입력하세요" minHeight={120} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <label className="flex items-center gap-2 text-body-sm text-ink-700">
          <Switch checked={isPublic} onChange={(e) => togglePublic(e.target.checked)} disabled={busy} />
          공개 게시판 노출 {isPublic && !post.answered && <span className="text-caption text-danger">· 답변 저장 후 노출됩니다</span>}
        </label>
        <div className="flex gap-2">
          <Button size="sm" tone="primary" onClick={saveAnswer} disabled={!answerDirty || busy}>답변 저장</Button>
          <Button size="sm" variant="soft" tone="danger" onClick={remove} disabled={busy}>삭제</Button>
        </div>
      </div>
    </div>
  );
}

export default function QnaManager({ posts }) {
  const router = useRouter();
  const refresh = () => router.refresh();
  if (posts.length === 0) {
    return <div className="text-body-sm text-ink-500">접수된 문의가 없습니다.</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      {posts.map((p) => (
        <QnaItem key={p.id} post={p} onChanged={refresh} />
      ))}
    </div>
  );
}
