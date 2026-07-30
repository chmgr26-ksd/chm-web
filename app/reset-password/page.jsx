'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthCard, Field, Input, Button, Alert } from '@chm/design-system';

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const mismatch = confirm.length > 0 && pw !== confirm;

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (pw.length < 8) { setMsg({ tone: 'danger', text: '새 비밀번호는 8자 이상이어야 합니다.' }); return; }
    if (pw !== confirm) { setMsg({ tone: 'danger', text: '비밀번호가 일치하지 않습니다.' }); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: pw }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '재설정에 실패했습니다.' }); return; }
      setDone(true);
      setMsg({ tone: 'success', text: '비밀번호가 변경되었습니다. 잠시 후 로그인 화면으로 이동합니다.' });
      setTimeout(() => router.push('/login'), 1600);
    } catch {
      setMsg({ tone: 'danger', text: '네트워크 오류로 변경하지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <Alert tone="danger">잘못된 접근입니다. 재설정 링크를 다시 요청해 주세요.</Alert>;
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <Field label="새 비밀번호" required htmlFor="rp-new" hint="8자 이상">
        <Input id="rp-new" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" disabled={done} />
      </Field>
      <Field label="새 비밀번호 확인" required htmlFor="rp-confirm" error={mismatch ? '비밀번호가 일치하지 않습니다.' : undefined}>
        <Input id="rp-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" invalid={mismatch} disabled={done} />
      </Field>
      <Button type="submit" size="lg" block loading={loading} disabled={mismatch || done}>비밀번호 변경</Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-warm px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/" aria-label="CHM Group 홈">
            <img src="/logo.png?v=2" alt="CHM Group" className="h-9 w-auto" />
          </Link>
        </div>
        <AuthCard
          title="새 비밀번호 설정"
          subtitle="새로 사용할 비밀번호를 입력해 주세요"
          footer={<><Link href="/login" className="font-semibold text-primary">로그인으로 돌아가기</Link></>}
        >
          <Suspense fallback={<div className="text-body-sm text-ink-500">불러오는 중…</div>}>
            <ResetForm />
          </Suspense>
        </AuthCard>
      </div>
    </div>
  );
}
