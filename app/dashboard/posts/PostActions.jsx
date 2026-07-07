'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@chm/design-system';

export default function PostActions({ id, published }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    });
    setBusy(false);
    router.refresh();
  };

  const remove = async () => {
    if (!confirm('이 소식을 삭제할까요? 되돌릴 수 없습니다.')) return;
    setBusy(true);
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      <Button as={Link} href={`/dashboard/posts/${id}/edit`} variant="soft" tone="primary" size="sm">수정</Button>
      <Button variant="ghost" tone="ink" size="sm" onClick={toggle} disabled={busy}>{published ? '비공개' : '공개'}</Button>
      <Button variant="ghost" tone="danger" size="sm" onClick={remove} disabled={busy}>삭제</Button>
    </div>
  );
}
