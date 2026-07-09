'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@chm/design-system';

export default function DeleteUser({ id, name }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const remove = async () => {
    if (!confirm(`'${name}' 회원을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErr(d.error || '삭제에 실패했습니다.');
        return;
      }
      router.refresh();
    } catch {
      setErr('네트워크 오류');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="ghost" tone="danger" size="sm" onClick={remove} disabled={busy}>삭제</Button>
      {err && <span className="text-caption text-danger-600">{err}</span>}
    </div>
  );
}
