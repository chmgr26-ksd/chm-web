'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AuthCard, Field, Input, Button, Alert } from '@chm/design-system';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || '가입에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        return;
      }
      // 가입 후 자동 로그인 → 홈 (일반 회원)
      const login = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
      if (login?.error) {
        router.push('/login');
        return;
      }
      router.push('/');
      router.refresh();
    } catch {
      setError('네트워크 오류로 가입하지 못했습니다. 잠시 후 다시 시도해 주세요.');
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
          title="회원가입"
          subtitle="CHM Group 회원으로 참여하세요"
          footer={<>이미 계정이 있으신가요? <Link href="/login" className="font-semibold text-primary">로그인</Link></>}
        >
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            {error && <Alert tone="danger">{error}</Alert>}
            <Field label="이름" required htmlFor="name">
              <Input id="name" value={form.name} onChange={set('name')} placeholder="홍길동" autoComplete="name" />
            </Field>
            <Field label="이메일" required htmlFor="email">
              <Input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" />
            </Field>
            <Field label="연락처" htmlFor="phone">
              <Input id="phone" value={form.phone} onChange={set('phone')} placeholder="010-0000-0000" inputMode="tel" autoComplete="tel" />
            </Field>
            <Field label="비밀번호" required htmlFor="password" hint="8자 이상">
              <Input id="password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" autoComplete="new-password" />
            </Field>
            <Button type="submit" size="lg" block loading={loading}>가입하기</Button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
