'use client';

import { useState } from 'react';
import { Field, Input, Button, Alert } from '@chm/design-system';

export default function PasswordForm() {
  const [cur, setCur] = useState('');
  const [nw, setNw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const mismatch = confirm.length > 0 && nw !== confirm;

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (nw.length < 8) {
      setMsg({ tone: 'danger', text: '새 비밀번호는 8자 이상이어야 합니다.' });
      return;
    }
    if (nw !== confirm) {
      setMsg({ tone: 'danger', text: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }
    setSaving(true);
    const res = await fetch('/api/account/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: cur, newPassword: nw }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setMsg({ tone: 'danger', text: data.error || '변경에 실패했습니다.' });
      return;
    }
    setMsg({ tone: 'success', text: '비밀번호가 변경되었습니다.' });
    setCur('');
    setNw('');
    setConfirm('');
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <Field label="현재 비밀번호" required htmlFor="pw-cur">
        <Input id="pw-cur" type="password" value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" />
      </Field>
      <Field label="새 비밀번호" required htmlFor="pw-new" hint="8자 이상">
        <Input id="pw-new" type="password" value={nw} onChange={(e) => setNw(e.target.value)} autoComplete="new-password" />
      </Field>
      <Field
        label="새 비밀번호 확인"
        required
        htmlFor="pw-confirm"
        error={mismatch ? '새 비밀번호와 일치하지 않습니다.' : undefined}
      >
        <Input
          id="pw-confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          invalid={mismatch}
        />
      </Field>
      <Button type="submit" tone="ink" variant="outline" size="md" loading={saving} disabled={mismatch}>비밀번호 변경</Button>
    </form>
  );
}
