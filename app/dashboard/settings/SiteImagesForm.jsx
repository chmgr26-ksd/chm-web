'use client';

import { useState, useRef } from 'react';
import { Button, Alert } from '@chm/design-system';

// SITE_IMAGE_SLOTS(서버 전용)와 동기화 — 클라이언트 표시용 목록.
// motion: true → 정적 이미지 외에 모션 GIF·영상(mp4/webm) 업로드 허용.
const SLOTS = [
  { key: 'landing-hero', label: '랜딩 · 히어로 이미지', page: '/', motion: true },
  { key: 'main-field', label: '메인 · 현장 사진', page: '/main' },
  { key: 'about-team', label: '소개 · 단체 사진', page: '/about' },
  { key: 'business-field', label: '사업 안내 · 현장 사진', page: '/business' },
];

// 영상 파일의 첫 프레임을 캔버스로 캡처해 JPEG Blob 반환(실패 시 null).
// <video poster>로 저장되어 로딩 중 빈 화면 대신 현재 영상의 장면이 표시된다.
function captureVideoPoster(file) {
  return new Promise((resolve) => {
    let settled = false;
    let url;
    const done = (blob) => {
      if (settled) return;
      settled = true;
      if (url) { try { URL.revokeObjectURL(url); } catch {} }
      resolve(blob);
    };
    try {
      url = URL.createObjectURL(file);
      const v = document.createElement('video');
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';
      const draw = () => {
        const w = v.videoWidth, h = v.videoHeight;
        if (!w || !h) return done(null);
        try {
          const c = document.createElement('canvas');
          c.width = w; c.height = h;
          c.getContext('2d').drawImage(v, 0, 0, w, h);
          c.toBlob((b) => done(b), 'image/jpeg', 0.82);
        } catch { done(null); }
      };
      v.onloadeddata = () => {
        // 첫 프레임이 검은 화면일 수 있어 살짝 시크 후 캡처.
        const t = Math.min(0.1, (isFinite(v.duration) ? v.duration : 1) / 2);
        if (t > 0) { try { v.currentTime = t; } catch { draw(); } } else { draw(); }
      };
      v.onseeked = draw;
      v.onerror = () => done(null);
      setTimeout(() => done(null), 5000); // 안전 타임아웃
      v.src = url;
    } catch { done(null); }
  });
}

function Slot({ slot, initialKind, onMsg }) {
  const [ver, setVer] = useState(() => 'init');
  const [kind, setKind] = useState(initialKind || 'image');
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
      if (file.type?.startsWith('video/')) {
        const poster = await captureVideoPoster(file);
        if (poster) fd.append('poster', poster, 'poster.jpg');
      }
      const res = await fetch(`/api/settings/site-image/${slot.key}`, { method: 'POST', body: fd });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { onMsg({ tone: 'danger', text: `${slot.label}: ${d.error || '업로드 실패'}` }); return; }
      setKind(file.type?.startsWith('video/') ? 'video' : 'image');
      onMsg({ tone: 'success', text: `${slot.label}을(를) 교체했습니다.` });
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
      setKind('image');
      onMsg({ tone: 'success', text: `${slot.label}을(를) 기본 이미지로 되돌렸습니다.` });
      bump();
    } catch {
      onMsg({ tone: 'danger', text: '네트워크 오류로 되돌리지 못했습니다.' });
    } finally {
      setBusy(false);
    }
  };

  const src = `/api/site-image/${slot.key}?v=${ver}`;
  return (
    <div className="flex gap-4 rounded-chm-lg border border-border p-4">
      {kind === 'video' ? (
        <video
          src={src}
          muted
          loop
          autoPlay
          playsInline
          className="h-24 w-32 flex-none rounded-chm-md border border-border object-cover"
        />
      ) : (
        <img
          src={src}
          alt={slot.label}
          className="h-24 w-32 flex-none rounded-chm-md border border-border object-cover"
        />
      )}
      <div className="flex flex-1 flex-col gap-2">
        <div className="text-body-sm font-bold text-ink-800">{slot.label}</div>
        <div className="text-caption text-ink-500">
          {slot.page} 페이지 ·{' '}
          {slot.motion
            ? '이미지는 1920px·JPEG로 최적화, 모션 GIF·영상(mp4·webm, 12MB 이하)은 원본 그대로 저장됩니다'
            : '업로드 시 자동으로 1920px·JPEG로 최적화됩니다'}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept={slot.motion ? 'image/*,video/mp4,video/webm' : 'image/*'}
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

export default function SiteImagesForm({ initialKinds = {} }) {
  const [msg, setMsg] = useState(null);
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      {SLOTS.map((s) => (
        <Slot key={s.key} slot={s} initialKind={initialKinds[s.key]} onMsg={setMsg} />
      ))}
    </div>
  );
}
