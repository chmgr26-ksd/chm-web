'use client';

import { useState, useEffect } from 'react';
import { Field, Input, Textarea, Switch, Button, Alert } from '@chm/design-system';

export default function MailSettingsForm() {
  const [form, setForm] = useState({
    mailEnabled: false, mailRecipients: '', smtpHost: '', smtpPort: 587, smtpUser: '', smtpFrom: '', smtpPassword: '',
  });
  const [hasPassword, setHasPassword] = useState(false);
  const [envFallback, setEnvFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch('/api/settings/mail')
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          setForm((f) => ({
            ...f,
            mailEnabled: d.mailEnabled, mailRecipients: d.mailRecipients || '',
            smtpHost: d.smtpHost || '', smtpPort: d.smtpPort || 587,
            smtpUser: d.smtpUser || '', smtpFrom: d.smtpFrom || '', smtpPassword: '',
          }));
          setHasPassword(d.hasPassword);
          setEnvFallback(d.envFallback);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    try {
      const res = await fetch('/api/settings/mail', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '저장에 실패했습니다.' }); return; }
      setMsg({ tone: 'success', text: '저장되었습니다.' });
      if (form.smtpPassword) setHasPassword(true);
      setForm((f) => ({ ...f, smtpPassword: '' }));
      setEnvFallback(false);
    } catch {
      setMsg({ tone: 'danger', text: '네트워크 오류로 저장하지 못했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    setMsg(null);
    setTesting(true);
    try {
      const res = await fetch('/api/settings/mail/test', { method: 'POST' });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '테스트 발송에 실패했습니다.' }); return; }
      setMsg({ tone: 'success', text: `테스트 메일을 보냈습니다 → ${d.to}` });
    } catch {
      setMsg({ tone: 'danger', text: '네트워크 오류로 발송하지 못했습니다.' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <div className="text-body-sm text-ink-500">불러오는 중…</div>;

  return (
    <form onSubmit={save} className="flex max-w-2xl flex-col gap-5">
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      {envFallback && (
        <Alert tone="info">현재 환경변수(SMTP_*)로 동작 중입니다. 아래 저장 시 DB 설정이 우선 적용됩니다.</Alert>
      )}

      <div className="flex items-center justify-between rounded-chm-lg border border-border p-4">
        <div>
          <div className="text-body font-semibold text-ink-800">문의 접수 알림 사용</div>
          <div className="text-caption text-ink-500">새 문의가 들어오면 아래 수신자에게 메일을 보냅니다.</div>
        </div>
        <Switch checked={form.mailEnabled} onChange={(e) => setForm((f) => ({ ...f, mailEnabled: e.target.checked }))} />
      </div>

      <Field label="수신 이메일" hint="여러 개는 콤마(,)로 구분. 비우면 관리자 전체에게 발송">
        <Textarea rows={2} value={form.mailRecipients} onChange={set('mailRecipients')} placeholder="alert@chm.kr, boss@chm.kr" />
      </Field>

      <div className="border-t border-border pt-5">
        <div className="mb-3 text-body-sm font-bold text-ink-700">발신 SMTP 계정</div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="SMTP 호스트"><Input value={form.smtpHost} onChange={set('smtpHost')} placeholder="smtp.hostinger.com" /></Field>
          <Field label="포트" hint="465(SSL) 또는 587"><Input value={form.smtpPort} onChange={set('smtpPort')} inputMode="numeric" /></Field>
          <Field label="계정(사용자)"><Input value={form.smtpUser} onChange={set('smtpUser')} placeholder="noreply@chm.kr" autoComplete="off" /></Field>
          <Field label="비밀번호" hint={hasPassword ? '설정됨 — 변경 시에만 입력' : '메일 계정 비밀번호'}>
            <Input type="password" value={form.smtpPassword} onChange={set('smtpPassword')} placeholder={hasPassword ? '••••••• (변경 시 입력)' : ''} autoComplete="new-password" />
          </Field>
          <Field label="발신 표시(선택)" className="sm:col-span-2"><Input value={form.smtpFrom} onChange={set('smtpFrom')} placeholder="CHM Group <noreply@chm.kr>" /></Field>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-5">
        <Button type="submit" tone="primary" loading={saving}>저장</Button>
        <Button type="button" variant="outline" tone="ink" onClick={test} loading={testing}>테스트 메일 발송</Button>
      </div>
      <p className="text-caption text-ink-500">비밀번호는 서버에서 암호화되어 저장되며, 화면에 다시 표시되지 않습니다.</p>
    </form>
  );
}
