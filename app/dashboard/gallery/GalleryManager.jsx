'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Field, Input, Select, Button, Alert } from '@chm/design-system';

// 해상도(사이즈) 프리셋 — 저장되는 원본의 최대 변, JPEG 품질.
const SIZE_PRESETS = {
  high: { label: '고화질 (1600px)', maxDim: 1600, quality: 0.9 },
  standard: { label: '표준 (1200px)', maxDim: 1200, quality: 0.85 },
  light: { label: '가벼움 (800px)', maxDim: 800, quality: 0.8 },
};
// 썸네일(그리드) 비율 — 중앙 크롭. null이면 원본 비율 유지.
const RATIO_PRESETS = {
  original: { label: '원본 비율', ar: null },
  square: { label: '정사각형 1:1', ar: 1 },
  landscape: { label: '가로 4:3', ar: 4 / 3 },
  portrait: { label: '세로 3:4', ar: 3 / 4 },
};
const SIZE_OPTIONS = Object.entries(SIZE_PRESETS).map(([value, p]) => ({ value, label: p.label }));
const RATIO_OPTIONS = Object.entries(RATIO_PRESETS).map(([value, p]) => ({ value, label: p.label }));

// 브라우저에서 이미지를 리사이즈(+선택적 중앙 크롭)해 JPEG Blob 반환.
// 서버 이미지 처리 불필요 → 메모리 안전. imageOrientation으로 EXIF 회전 반영.
async function renderResized(file, { maxDim, quality, ratio = null }) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  let sx = 0, sy = 0, sw = bitmap.width, sh = bitmap.height;

  // 원하는 비율(width/height)로 중앙 크롭.
  if (ratio) {
    const srcAR = sw / sh;
    if (srcAR > ratio) {
      const newW = sh * ratio;
      sx = (sw - newW) / 2;
      sw = newW;
    } else {
      const newH = sw / ratio;
      sy = (sh - newH) / 2;
      sh = newH;
    }
  }

  // 크롭 영역을 maxDim에 맞춰 축소(확대는 안 함).
  let ow = sw, oh = sh;
  if (ow > maxDim || oh > maxDim) {
    const scale = Math.min(maxDim / ow, maxDim / oh);
    ow = ow * scale;
    oh = oh * scale;
  }
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(ow));
  canvas.height = Math.max(1, Math.round(oh));
  canvas.getContext('2d').drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  if (bitmap.close) bitmap.close();
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
}

function GalleryItem({ img, onChanged }) {
  const [title, setTitle] = useState(img.title || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const dirty = title !== (img.title || '');

  const save = async () => {
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(`/api/gallery/${img.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setErr(d.error || '저장 실패'); return; }
      onChanged();
    } catch {
      setErr('네트워크 오류');
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!confirm('이 사진을 삭제할까요?')) return;
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(`/api/gallery/${img.id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setErr(d.error || '삭제 실패'); return; }
      onChanged();
    } catch {
      setErr('네트워크 오류');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-chm-lg border border-border">
      <img src={`/api/gallery/${img.id}?v=thumb`} alt={img.title || ''} loading="lazy" className="aspect-square w-full object-cover" />
      <div className="flex flex-col gap-2 p-2.5">
        {err && <span className="text-caption text-danger-600">{err}</span>}
        <Input size="sm" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="설명(선택)" />
        <div className="flex gap-1.5">
          <Button size="sm" tone="primary" onClick={save} disabled={!dirty || busy} className="flex-1">저장</Button>
          <Button size="sm" variant="soft" tone="danger" onClick={remove} disabled={busy}>삭제</Button>
        </div>
      </div>
    </div>
  );
}

export default function GalleryManager({ images }) {
  const router = useRouter();
  const refresh = () => router.refresh();
  const fileRef = useRef(null);
  const [title, setTitle] = useState('');
  const [size, setSize] = useState('standard');
  const [ratio, setRatio] = useState('original');
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);

  const upload = async (e) => {
    e.preventDefault();
    setMsg(null);
    const file = fileRef.current?.files?.[0];
    if (!file) { setMsg({ tone: 'danger', text: '이미지 파일을 선택해 주세요.' }); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      const preset = SIZE_PRESETS[size] || SIZE_PRESETS.standard;
      const ar = RATIO_PRESETS[ratio]?.ar ?? null;
      // 원본은 선택 해상도로 축소(크롭 없이 전체 보존 → 라이트박스용),
      // 썸네일은 선택 비율로 중앙 크롭. 실패 시 원본 파일 그대로 전송(서버가 검증).
      try {
        const [main, thumb] = await Promise.all([
          renderResized(file, { maxDim: preset.maxDim, quality: preset.quality, ratio: null }),
          renderResized(file, { maxDim: 700, quality: 0.8, ratio: ar }),
        ]);
        fd.append('file', main || file, main ? 'image.jpg' : file.name);
        if (thumb) fd.append('thumb', thumb, 'thumb.jpg');
      } catch {
        fd.append('file', file);
      }
      if (title.trim()) fd.append('title', title.trim());

      const res = await fetch('/api/gallery', { method: 'POST', body: fd });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '업로드에 실패했습니다.' }); return; }
      setTitle('');
      if (fileRef.current) fileRef.current.value = '';
      setMsg({ tone: 'success', text: '업로드되었습니다.' });
      refresh();
    } catch {
      setMsg({ tone: 'danger', text: '네트워크 오류로 업로드하지 못했습니다.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={upload} className="flex flex-col gap-3 rounded-chm-lg border border-border bg-surface-warm p-5">
        <div className="text-body-sm font-bold text-ink-800">사진 업로드</div>
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="이미지 파일" hint="원본은 선택한 해상도로 저장됩니다">
            <input ref={fileRef} type="file" accept="image/*" className="block w-full text-body-sm text-ink-700 file:mr-3 file:rounded-chm-md file:border-0 file:bg-ink-100 file:px-3 file:py-2 file:text-body-sm file:font-semibold file:text-ink-700" />
          </Field>
          <Field label="설명(선택)"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 어은동 집수리 현장" /></Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="해상도" hint="용량·화질">
            <Select value={size} onChange={(e) => setSize(e.target.value)} options={SIZE_OPTIONS} />
          </Field>
          <Field label="썸네일 비율" hint="목록 미리보기 모양">
            <Select value={ratio} onChange={(e) => setRatio(e.target.value)} options={RATIO_OPTIONS} />
          </Field>
          <Button type="submit" tone="primary" loading={uploading}>업로드</Button>
        </div>
      </form>

      {images.length === 0 ? (
        <div className="text-body-sm text-ink-500">등록된 사진이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <GalleryItem key={img.id} img={img} onChanged={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}
