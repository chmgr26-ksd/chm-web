'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { AuthCard, Field, Input, Button, Alert } from '@chm/design-system';
import { can } from '@/lib/rbac';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signIn('credentials', { email, password: pw, redirect: false });
      if (res?.error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
      }
      // 권한에 따라 이동: 직원·관리자 → 대시보드, 일반 → 홈
      const session = await getSession();
      router.push(can(session?.user, 'dashboard:access') ? '/dashboard' : '/');
      router.refresh();
    } catch {
      setError('네트워크 오류로 로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-warm px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/" aria-label="CHM Group 홈">
            <img src="/logo.png" alt="CHM Group" className="h-9 w-auto" />
          </Link>
        </div>
        <AuthCard
          title="로그인"
          subtitle="CHM Group 업무 플랫폼"
          footer={<>계정이 없으신가요? <Link href="/signup" className="font-semibold text-primary">회원가입</Link></>}
        >
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            {error && <Alert tone="danger">{error}</Alert>}
            <Field label="이메일" htmlFor="email">
              <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="비밀번호" htmlFor="pw">
              <Input id="pw" type="password" autoComplete="current-password" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} />
            </Field>
            <Button type="submit" size="lg" block loading={loading}>로그인</Button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
