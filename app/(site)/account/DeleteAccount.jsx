'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Field, Input, Button, Alert } from '@chm/design-system';

export default function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const remove = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const res = await fetch('/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErr(d.error || '탈퇴에 실패했습니다.');
        return;
      }
      // 탈퇴 완료 → 로그아웃 후 홈으로(프록시 뒤 절대URL 문제 회피).
      await signOut({ redirect: false });
      window.location.href = '/';
    } catch {
      setErr('네트워크 오류로 처리하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-chm-lg border border-border p-6">
      <h2 className="mb-1 text-h4 font-bold text-danger-700">회원 탈퇴</h2>
      <p className="mb-4 text-body-sm text-ink-600">
        탈퇴하면 계정 정보가 삭제되며 되돌릴 수 없습니다. (신청 내역은 익명 처리되어 보존됩니다.)
      </p>
      {!open ? (
        <Button tone="danger" variant="outline" size="sm" onClick={() => setOpen(true)}>회원 탈퇴</Button>
      ) : (
        <form onSubmit={remove} className="flex flex-col gap-3">
          {err && <Alert tone="danger">{err}</Alert>}
          <Field label="비밀번호 확인" required htmlFor="del-pw" hint="본인 확인을 위해 비밀번호를 입력해 주세요">
            <Input id="del-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </Field>
          <div className="flex gap-2">
            <Button type="submit" tone="danger" size="sm" loading={busy} disabled={!password}>탈퇴하기</Button>
            <Button type="button" variant="ghost" tone="ink" size="sm" onClick={() => { setOpen(false); setPassword(''); setErr(''); }}>취소</Button>
          </div>
        </form>
      )}
    </div>
  );
}
