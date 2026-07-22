'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Field, Input, Switch, Button, Alert } from '@chm/design-system';
import { prepareUpload } from '@/lib/clientImage';
import { isBlankHtml } from '@/lib/sanitizeHtml';
import RichTextEditor from '@/components/dashboard/RichTextEditor';

const MAX_PHOTOS = 6;

// 파일 하나를 후기에 업로드(리사이즈 → multipart POST). 실패 시 원본 폴백.
async function uploadImage(reviewId, file, { role, sortOrder = 0, thumbRatio = null }) {
  const fd = new FormData();
  try {
    const { main, thumb } = await prepareUpload(file, { size: 'standard', thumbRatio });
    fd.append('file', main || file, main ? 'image.jpg' : file.name);
    if (thumb) fd.append('thumb', thumb, 'thumb.jpg');
  } catch {
    fd.append('file', file);
  }
  fd.append('role', role);
  fd.append('sortOrder', String(sortOrder));
  const res = await fetch(`/api/reviews/${reviewId}/images`, { method: 'POST', body: fd });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(d.error || '업로드 실패');
  return d;
}

// ── 교실 후기: 작성 시 사진 스테이징(등록 전 미리 담아두기, 최대 6장) ──
function StagedClassPhotos({ staged, setStaged, disabled }) {
  const fileRef = useRef(null);
  const add = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setStaged((prev) => {
      const room = MAX_PHOTOS - prev.length;
      const next = files.slice(0, room).map((file) => ({ file, url: URL.createObjectURL(file) }));
      return [...prev, ...next];
    });
    if (fileRef.current) fileRef.current.value = '';
  };
  const removeAt = (i) => setStaged((prev) => {
    URL.revokeObjectURL(prev[i].url);
    return prev.filter((_, idx) => idx !== i);
  });
  const full = staged.length >= MAX_PHOTOS;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption font-semibold text-ink-600">사진 {staged.length}/{MAX_PHOTOS} · 담은 순서대로 롤링됩니다</span>
      {staged.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {staged.map((s, i) => (
            <div key={s.url} className="group relative overflow-hidden rounded-chm-md border border-border">
              <img src={s.url} alt="" className="aspect-[4/3] w-full object-cover" />
              <span className="absolute left-1 top-1 rounded bg-black/60 px-1 text-caption text-white">{i + 1}</span>
              <button type="button" disabled={disabled} onClick={() => removeAt(i)} className="absolute inset-x-0 bottom-0 bg-black/45 py-0.5 text-caption text-white opacity-0 transition hover:text-danger-300 group-hover:opacity-100">삭제</button>
            </div>
          ))}
        </div>
      )}
      <label className={`inline-flex w-fit cursor-pointer items-center gap-2 rounded-chm-md border border-dashed border-border px-3 py-2 text-body-sm ${full || disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-primary hover:text-primary'}`}>
        <input ref={fileRef} type="file" accept="image/*" multiple disabled={full || disabled} onChange={add} className="hidden" />
        {full ? '최대 장수 도달' : '＋ 사진 선택'}
      </label>
    </div>
  );
}

// ── 체험 후기: 작성 시 Before/After 스테이징 ──
function StagedBASlot({ label, item, onPick, onClear, disabled }) {
  const fileRef = useRef(null);
  const pick = (e) => {
    const file = e.target.files?.[0];
    if (file) onPick({ file, url: URL.createObjectURL(file) });
    if (fileRef.current) fileRef.current.value = '';
  };
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption font-semibold text-ink-600">{label}</span>
      <div className="relative overflow-hidden rounded-chm-md border border-border bg-surface-muted">
        {item ? <img src={item.url} alt={label} className="aspect-[4/3] w-full object-cover" />
          : <div className="grid aspect-[4/3] w-full place-items-center text-caption text-ink-400">미등록</div>}
      </div>
      <div className="flex gap-1.5">
        <label className={`flex-1 cursor-pointer rounded-chm-md border border-dashed border-border px-2 py-1.5 text-center text-caption ${disabled ? 'opacity-50' : 'hover:border-primary hover:text-primary'}`}>
          <input ref={fileRef} type="file" accept="image/*" disabled={disabled} onChange={pick} className="hidden" />
          {item ? '교체' : '사진 선택'}
        </label>
        {item && <Button size="sm" variant="soft" tone="danger" onClick={onClear} disabled={disabled}>삭제</Button>}
      </div>
    </div>
  );
}

// ── 신규 후기 작성 폼(글 + 사진을 한 번에 등록) ──
function NewReviewForm({ type, onCreated }) {
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [body, setBody] = useState('');
  const [published, setPublished] = useState(true);
  const [staged, setStaged] = useState([]);        // 교실: [{file,url}]
  const [before, setBefore] = useState(null);      // 체험: {file,url}
  const [after, setAfter] = useState(null);
  const [bodyKey, setBodyKey] = useState(0);       // 등록 후 에디터 리셋용
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // 언마운트 시에만 남은 미리보기 objectURL 정리 — ref로 최신 값을 추적(deps 없이).
  const liveRef = useRef({ staged, before, after });
  liveRef.current = { staged, before, after };
  useEffect(() => () => {
    const { staged: s, before: b, after: a } = liveRef.current;
    s.forEach((x) => URL.revokeObjectURL(x.url));
    if (b) URL.revokeObjectURL(b.url);
    if (a) URL.revokeObjectURL(a.url);
  }, []);

  const reset = () => {
    staged.forEach((s) => URL.revokeObjectURL(s.url));
    if (before) URL.revokeObjectURL(before.url);
    if (after) URL.revokeObjectURL(after.url);
    setTitle(''); setAuthorName(''); setBody(''); setPublished(true);
    setStaged([]); setBefore(null); setAfter(null); setBodyKey((k) => k + 1);
  };
  const clearBefore = () => { if (before) URL.revokeObjectURL(before.url); setBefore(null); };
  const clearAfter = () => { if (after) URL.revokeObjectURL(after.url); setAfter(null); };

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!title.trim() || isBlankHtml(body)) { setMsg({ tone: 'danger', text: '제목과 내용을 입력해 주세요.' }); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title, body, authorName, published }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '등록에 실패했습니다.' }); return; }

      // 후기 생성 성공 → 스테이징한 사진 순차 업로드. 사진 실패해도 글은 이미 저장됨.
      try {
        if (type === 'CLASS') {
          for (let i = 0; i < staged.length; i++) {
            await uploadImage(d.id, staged[i].file, { role: 'PHOTO', sortOrder: i, thumbRatio: 4 / 3 });
          }
        } else {
          if (before) await uploadImage(d.id, before.file, { role: 'BEFORE', thumbRatio: 4 / 3 });
          if (after) await uploadImage(d.id, after.file, { role: 'AFTER', thumbRatio: 4 / 3 });
        }
      } catch (imgErr) {
        setMsg({ tone: 'danger', text: `후기는 등록됐지만 일부 사진 업로드에 실패했습니다: ${imgErr.message}. 아래 목록에서 다시 추가해 주세요.` });
        reset(); onCreated(); return;
      }
      reset(); onCreated();
    } catch {
      setMsg({ tone: 'danger', text: '네트워크 오류로 등록하지 못했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-chm-lg border border-border bg-surface-warm p-5">
      <div className="text-body-sm font-bold text-ink-800">새 후기 작성</div>
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <Field label="제목" required>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={type === 'CLASS' ? '예: 3기 집수리 교실 후기' : '예: 어은동 김OO님 댁 창호 교체'} />
        </Field>
        <Field label="작성자(선택)">
          <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="예: 참가자 이OO" />
        </Field>
      </div>
      <Field label="내용" required hint="굵게·목록·링크 등 서식을 넣을 수 있습니다">
        <RichTextEditor key={bodyKey} value="" onChange={setBody} placeholder={type === 'CLASS' ? '교실 참여 후기를 입력하세요' : '작업 전·후 상황과 설명을 입력하세요'} minHeight={150} />
      </Field>

      <div className="rounded-chm-md border border-border bg-surface p-3">
        <div className="mb-2 text-caption font-semibold text-ink-700">{type === 'CLASS' ? '사진 (좌측 자동 롤링, 1~6장)' : 'Before / After 사진'}</div>
        {type === 'CLASS'
          ? <StagedClassPhotos staged={staged} setStaged={setStaged} disabled={saving} />
          : (
            <div className="grid grid-cols-2 gap-3">
              <StagedBASlot label="Before (수리 전)" item={before} onPick={setBefore} onClear={clearBefore} disabled={saving} />
              <StagedBASlot label="After (수리 후)" item={after} onPick={setAfter} onClear={clearAfter} disabled={saving} />
            </div>
          )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-body-sm text-ink-700">
          <Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />
          {published ? '공개' : '비공개'}
        </label>
        <Button type="submit" tone="primary" loading={saving}>등록</Button>
      </div>
    </form>
  );
}

// ── 교실 후기 사진 관리(1~6장, 롤링 순서) ──
function ClassPhotos({ review, onChanged }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const photos = [...review.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const full = photos.length >= MAX_PHOTOS;

  const add = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setErr(''); setBusy(true);
    try {
      let order = photos.length ? Math.max(...photos.map((p) => p.sortOrder)) + 1 : 0;
      const room = MAX_PHOTOS - photos.length;
      for (const file of files.slice(0, room)) {
        await uploadImage(review.id, file, { role: 'PHOTO', sortOrder: order++, thumbRatio: 4 / 3 });
      }
      if (files.length > room) setErr(`최대 ${MAX_PHOTOS}장까지만 등록됩니다.`);
      if (fileRef.current) fileRef.current.value = '';
      onChanged();
    } catch (e) {
      setErr(e.message || '업로드 실패');
    } finally {
      setBusy(false);
    }
  };

  const removeImg = async (id) => {
    if (!confirm('이 사진을 삭제할까요?')) return;
    setBusy(true); setErr('');
    try {
      const res = await fetch(`/api/review-images/${id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setErr(d.error || '삭제 실패'); return; }
      onChanged();
    } finally { setBusy(false); }
  };

  // 인접 사진과 sortOrder 교환 → 롤링 순서 변경.
  const move = async (idx, dir) => {
    const a = photos[idx], b = photos[idx + dir];
    if (!a || !b) return;
    setBusy(true); setErr('');
    try {
      await Promise.all([
        fetch(`/api/review-images/${a.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sortOrder: b.sortOrder }) }),
        fetch(`/api/review-images/${b.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sortOrder: a.sortOrder }) }),
      ]);
      onChanged();
    } finally { setBusy(false); }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-caption font-semibold text-ink-600">롤링 사진 {photos.length}/{MAX_PHOTOS}</span>
        {err && <span className="text-caption text-danger-600">{err}</span>}
      </div>
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {photos.map((p, i) => (
            <div key={p.id} className="group relative overflow-hidden rounded-chm-md border border-border">
              <img src={`/api/review-images/${p.id}?v=thumb`} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <span className="absolute left-1 top-1 rounded bg-black/60 px-1 text-caption text-white">{i + 1}</span>
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-0.5 bg-black/45 p-0.5 opacity-0 transition group-hover:opacity-100">
                <button type="button" disabled={busy || i === 0} onClick={() => move(i, -1)} className="rounded px-1 text-caption text-white disabled:opacity-30">←</button>
                <button type="button" disabled={busy} onClick={() => removeImg(p.id)} className="rounded px-1 text-caption text-white hover:text-danger-300">삭제</button>
                <button type="button" disabled={busy || i === photos.length - 1} onClick={() => move(i, 1)} className="rounded px-1 text-caption text-white disabled:opacity-30">→</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <label className={`inline-flex w-fit cursor-pointer items-center gap-2 rounded-chm-md border border-dashed border-border px-3 py-2 text-body-sm ${full || busy ? 'cursor-not-allowed opacity-50' : 'hover:border-primary hover:text-primary'}`}>
        <input ref={fileRef} type="file" accept="image/*" multiple disabled={full || busy} onChange={add} className="hidden" />
        {busy ? '업로드 중…' : full ? '최대 장수 도달' : '＋ 사진 추가'}
      </label>
    </div>
  );
}

// ── 체험 후기 Before/After 슬롯 ──
function ExperiencePhotos({ review, onChanged }) {
  const before = review.images.find((i) => i.role === 'BEFORE');
  const after = review.images.find((i) => i.role === 'AFTER');
  return (
    <div className="grid grid-cols-2 gap-3">
      <BASlot review={review} role="BEFORE" label="Before (수리 전)" img={before} onChanged={onChanged} />
      <BASlot review={review} role="AFTER" label="After (수리 후)" img={after} onChanged={onChanged} />
    </div>
  );
}

function BASlot({ review, role, label, img, onChanged }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(''); setBusy(true);
    try {
      await uploadImage(review.id, file, { role, thumbRatio: 4 / 3 });
      if (fileRef.current) fileRef.current.value = '';
      onChanged();
    } catch (e) {
      setErr(e.message || '업로드 실패');
    } finally { setBusy(false); }
  };
  const remove = async () => {
    if (!img || !confirm('이 사진을 삭제할까요?')) return;
    setBusy(true); setErr('');
    try {
      const res = await fetch(`/api/review-images/${img.id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setErr(d.error || '삭제 실패'); return; }
      onChanged();
    } finally { setBusy(false); }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption font-semibold text-ink-600">{label}</span>
      <div className="relative overflow-hidden rounded-chm-md border border-border bg-surface-muted">
        {img ? (
          <img src={`/api/review-images/${img.id}?v=thumb`} alt={label} loading="lazy" className="aspect-[4/3] w-full object-cover" />
        ) : (
          <div className="grid aspect-[4/3] w-full place-items-center text-caption text-ink-400">미등록</div>
        )}
      </div>
      {err && <span className="text-caption text-danger-600">{err}</span>}
      <div className="flex gap-1.5">
        <label className={`flex-1 cursor-pointer rounded-chm-md border border-dashed border-border px-2 py-1.5 text-center text-caption ${busy ? 'opacity-50' : 'hover:border-primary hover:text-primary'}`}>
          <input ref={fileRef} type="file" accept="image/*" disabled={busy} onChange={pick} className="hidden" />
          {busy ? '업로드 중…' : img ? '교체' : '사진 선택'}
        </label>
        {img && <Button size="sm" variant="soft" tone="danger" onClick={remove} disabled={busy}>삭제</Button>}
      </div>
    </div>
  );
}

// ── 개별 후기 카드(필드 편집 + 이미지 관리 + 삭제) ──
function ReviewCard({ type, review, onChanged }) {
  const [title, setTitle] = useState(review.title);
  const [authorName, setAuthorName] = useState(review.authorName || '');
  const [body, setBody] = useState(review.body);
  const [published, setPublished] = useState(review.published);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const dirty = title !== review.title || (authorName || '') !== (review.authorName || '') || body !== review.body || published !== review.published;

  const save = async () => {
    if (!title.trim() || isBlankHtml(body)) { setMsg({ tone: 'danger', text: '제목과 내용을 입력해 주세요.' }); return; }
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, authorName, body, published }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '저장 실패' }); return; }
      setMsg({ tone: 'success', text: '저장되었습니다.' });
      onChanged();
    } finally { setBusy(false); }
  };
  const remove = async () => {
    if (!confirm('이 후기를 삭제할까요? 첨부 사진도 함께 삭제됩니다.')) return;
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setMsg({ tone: 'danger', text: d.error || '삭제 실패' }); return; }
      onChanged();
    } finally { setBusy(false); }
  };

  return (
    <div className="flex flex-col gap-3 rounded-chm-lg border border-border bg-surface p-5">
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <Field label="제목"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="작성자(선택)"><Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} /></Field>
      </div>
      <Field label="내용"><RichTextEditor value={review.body} onChange={setBody} minHeight={130} /></Field>

      <div className="rounded-chm-md border border-border bg-surface-warm p-3">
        {type === 'CLASS'
          ? <ClassPhotos review={review} onChanged={onChanged} />
          : <ExperiencePhotos review={review} onChanged={onChanged} />}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <label className="flex items-center gap-2 text-body-sm text-ink-700">
          <Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />
          {published ? '공개' : '비공개'}
        </label>
        <div className="flex gap-2">
          <Button size="sm" tone="primary" onClick={save} disabled={!dirty || busy}>저장</Button>
          <Button size="sm" variant="soft" tone="danger" onClick={remove} disabled={busy}>후기 삭제</Button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewManager({ type, reviews }) {
  const router = useRouter();
  const refresh = () => router.refresh();
  return (
    <div className="flex flex-col gap-6">
      <NewReviewForm type={type} onCreated={refresh} />
      {reviews.length === 0 ? (
        <div className="text-body-sm text-ink-500">등록된 후기가 없습니다.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => (
            <ReviewCard key={r.id} type={type} review={r} onChanged={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}
