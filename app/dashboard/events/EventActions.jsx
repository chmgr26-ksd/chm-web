'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@chm/design-system';

export default function EventActions({ id, published }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const toggle = async () => {
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setErr(d.error || '변경 실패'); return; }
      router.refresh();
    } catch {
      setErr('네트워크 오류');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm('이 행사를 삭제할까요? 되돌릴 수 없습니다.')) return;
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setErr(d.error || '삭제 실패'); return; }
      router.refresh();
    } catch {
      setErr('네트워크 오류');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-1.5">
        <Button as={Link} href={`/dashboard/events/${id}/edit`} variant="soft" tone="primary" size="sm">수정</Button>
        <Button variant="ghost" tone="ink" size="sm" onClick={toggle} disabled={busy}>{published ? '비공개' : '공개'}</Button>
        <Button variant="ghost" tone="danger" size="sm" onClick={remove} disabled={busy}>삭제</Button>
      </div>
      {err && <span className="text-caption text-danger-600">{err}</span>}
    </div>
  );
}
