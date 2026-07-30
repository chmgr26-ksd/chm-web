'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthCard, Field, Input, Button, Alert } from '@chm/design-system';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || '요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        return;
      }
      setSent(true);
    } catch {
      setError('네트워크 오류로 요청하지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-warm px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/" aria-label="CHM Group 홈">
            <img src="/logo.png?v=2" alt="CHM Group" className="h-9 w-auto" />
          </Link>
        </div>
        <AuthCard
          title="비밀번호 재설정"
          subtitle="가입한 이메일로 재설정 링크를 보내드립니다"
          footer={<><Link href="/login" className="font-semibold text-primary">로그인으로 돌아가기</Link></>}
        >
          {sent ? (
            <Alert tone="success">
              입력하신 이메일이 가입되어 있다면 재설정 링크를 보냈습니다. 메일함(스팸함 포함)을 확인해 주세요. 링크는 1시간 동안 유효합니다.
            </Alert>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
              {error && <Alert tone="danger">{error}</Alert>}
              <Field label="이메일" required htmlFor="email">
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
              </Field>
              <Button type="submit" size="lg" block loading={loading}>재설정 링크 보내기</Button>
            </form>
          )}
        </AuthCard>
      </div>
    </div>
  );
}
