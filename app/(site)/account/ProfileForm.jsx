'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Field, Input, Button, Alert } from '@chm/design-system';

export default function ProfileForm({ initialName, initialPhone }) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(initialName || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    const res = await fetch('/api/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setMsg({ tone: 'danger', text: data.error || '저장에 실패했습니다.' });
      return;
    }
    setMsg({ tone: 'success', text: '저장되었습니다.' });
    await update({ name }); // 헤더 등 세션 이름 동기화
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <Field label="이름" required htmlFor="pf-name">
        <Input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      </Field>
      <Field label="연락처" htmlFor="pf-phone">
        <Input id="pf-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" inputMode="tel" autoComplete="tel" />
      </Field>
      <Button type="submit" tone="primary" size="md" loading={saving}>정보 저장</Button>
    </form>
  );
}
