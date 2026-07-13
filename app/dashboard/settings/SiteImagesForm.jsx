'use client';

import { useState, useRef } from 'react';
import { Button, Alert } from '@chm/design-system';

// SITE_IMAGE_SLOTS(서버 전용)와 동기화 — 클라이언트 표시용 목록.
const SLOTS = [
  { key: 'landing-hero', label: '랜딩 · 히어로 이미지', page: '/' },
  { key: 'main-field', label: '메인 · 현장 사진', page: '/main' },
  { key: 'about-team', label: '소개 · 단체 사진', page: '/about' },
  { key: 'business-field', label: '사업 안내 · 현장 사진', page: '/business' },
];

function Slot({ slot, onMsg }) {
  const [ver, setVer] = useState(() => 'init');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const bump = () => setVer(String(Math.floor(performance.now())));

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onMsg(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`/api/settings/site-image/${slot.key}`, { method: 'POST', body: fd });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { onMsg({ tone: 'danger', text: `${slot.label}: ${d.error || '업로드 실패'}` }); return; }
      onMsg({ tone: 'success', text: `${slot.label} 이미지를 교체했습니다.` });
      bump();
    } catch {
      onMsg({ tone: 'danger', text: '네트워크 오류로 업로드하지 못했습니다.' });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const revert = async () => {
    onMsg(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/settings/site-image/${slot.key}`, { method: 'DELETE' });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { onMsg({ tone: 'danger', text: `${slot.label}: ${d.error || '되돌리기 실패'}` }); return; }
      onMsg({ tone: 'success', text: `${slot.label}을(를) 기본 이미지로 되돌렸습니다.` });
      bump();
    } catch {
      onMsg({ tone: 'danger', text: '네트워크 오류로 되돌리지 못했습니다.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex gap-4 rounded-chm-lg border border-border p-4">
      <img
        src={`/api/site-image/${slot.key}?v=${ver}`}
        alt={slot.label}
        className="h-24 w-32 flex-none rounded-chm-md border border-border object-cover"
      />
      <div className="flex flex-1 flex-col gap-2">
        <div className="text-body-sm font-bold text-ink-800">{slot.label}</div>
        <div className="text-caption text-ink-500">{slot.page} 페이지 · 업로드 시 자동으로 1920px·JPEG로 최적화됩니다</div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={upload}
            disabled={busy}
            className="block text-body-sm text-ink-700 file:mr-3 file:rounded-chm-md file:border-0 file:bg-ink-100 file:px-3 file:py-2 file:text-body-sm file:font-semibold file:text-ink-700"
          />
          <Button type="button" variant="soft" tone="ink" size="sm" onClick={revert} loading={busy}>기본값으로</Button>
        </div>
      </div>
    </div>
  );
}

export default function SiteImagesForm() {
  const [msg, setMsg] = useState(null);
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      {SLOTS.map((s) => (
        <Slot key={s.key} slot={s} onMsg={setMsg} />
      ))}
    </div>
  );
}
