'use client';

import { useState, useEffect } from 'react';
import { Field, Input, Textarea, Button, Alert } from '@chm/design-system';

// 연락처/기관 정보 편집 — 비우면 기본값으로 표시됨. 주소는 오시는 길 지도에도 반영.
const ROWS = [
  { key: 'contactPhone', label: '전화번호', ph: '010-0000-0000' },
  { key: 'contactEmail', label: '이메일', ph: 'name@example.com' },
  { key: 'contactAddress', label: '주소(지도용)', hint: '구글맵 검색에 사용 — 정확할수록 핀이 정확합니다', ph: '대전광역시 유성구 어은동 000-0' },
  { key: 'contactAddressDetail', label: '주소(표기용)', hint: '페이지에 표시되는 상세 주소', area: true },
  { key: 'contactHours', label: '운영 시간', area: true },
  { key: 'contactRep', label: '대표자' },
  { key: 'companyKo', label: '기관명(국문)' },
  { key: 'companyEn', label: '기관명(영문)' },
];

export default function ContactSettingsForm() {
  const [form, setForm] = useState({});
  const [defaults, setDefaults] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch('/api/settings/contact')
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          const { defaults: def, ...vals } = d;
          setForm(vals);
          setDefaults(def || {});
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
      const res = await fetch('/api/settings/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '저장에 실패했습니다.' }); return; }
      setMsg({ tone: 'success', text: '저장되었습니다. 공개 사이트에 곧 반영됩니다.' });
    } catch {
      setMsg({ tone: 'danger', text: '네트워크 오류로 저장하지 못했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-body-sm text-ink-500">불러오는 중…</div>;

  return (
    <form onSubmit={save} className="flex max-w-2xl flex-col gap-5">
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <Alert tone="info">비워두면 기본값(회색 예시)이 표시됩니다. 주소를 바꾸면 오시는 길 지도도 함께 반영됩니다.</Alert>
      <div className="grid gap-4 sm:grid-cols-2">
        {ROWS.map((r) => (
          <Field
            key={r.key}
            label={r.label}
            hint={r.hint}
            className={r.area ? 'sm:col-span-2' : undefined}
          >
            {r.area ? (
              <Textarea rows={2} value={form[r.key] || ''} onChange={set(r.key)} placeholder={defaults[r.key] || ''} />
            ) : (
              <Input value={form[r.key] || ''} onChange={set(r.key)} placeholder={r.ph || defaults[r.key] || ''} />
            )}
          </Field>
        ))}
      </div>
      <div className="border-t border-border pt-5">
        <Button type="submit" tone="primary" loading={saving}>저장</Button>
      </div>
    </form>
  );
}
