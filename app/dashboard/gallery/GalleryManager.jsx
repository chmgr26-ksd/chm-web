'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Field, Input, Button, Alert } from '@chm/design-system';

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
      <img src={`/api/gallery/${img.id}`} alt={img.title || ''} className="aspect-square w-full object-cover" />
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
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);

  const upload = async (e) => {
    e.preventDefault();
    setMsg(null);
    const file = fileRef.current?.files?.[0];
    if (!file) { setMsg({ tone: 'danger', text: '이미지 파일을 선택해 주세요.' }); return; }
    const fd = new FormData();
    fd.append('file', file);
    if (title.trim()) fd.append('title', title.trim());
    setUploading(true);
    try {
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
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="이미지 파일" hint="3MB 이하">
            <input ref={fileRef} type="file" accept="image/*" className="block w-full text-body-sm text-ink-700 file:mr-3 file:rounded-chm-md file:border-0 file:bg-ink-100 file:px-3 file:py-2 file:text-body-sm file:font-semibold file:text-ink-700" />
          </Field>
          <Field label="설명(선택)"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 어은동 집수리 현장" /></Field>
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
