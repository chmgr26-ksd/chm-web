'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthCard, Field, Input, Checkbox, Button, Alert } from '@chm/design-system';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');

  // Phase 0: UI만. Phase 2에서 Auth.js로 실제 인증 연결.
  const onSubmit = (e) => {
    e.preventDefault();
    setMsg('로그인 기능은 Phase 2(Auth.js)에서 연결됩니다.');
  };

  return (
    <AuthCard
      title="로그인"
      subtitle="CHM Group 업무 플랫폼"
      footer={<>계정이 없으신가요? <Link href="#" className="font-semibold text-trust-600">회원가입</Link></>}
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        {msg && <Alert tone="info">{msg}</Alert>}
        <Field label="이메일" htmlFor="email">
          <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="비밀번호" htmlFor="pw">
          <Input id="pw" type="password" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} />
        </Field>
        <div className="flex items-center justify-between">
          <Checkbox label="로그인 유지" />
          <Link href="#" className="text-body-sm font-semibold text-trust-600">비밀번호 찾기</Link>
        </div>
        <Button type="submit" size="lg" block>로그인</Button>
      </form>
    </AuthCard>
  );
}
