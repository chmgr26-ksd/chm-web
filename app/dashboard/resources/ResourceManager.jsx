'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Field, Input, Switch, Button, Alert } from '@chm/design-system';
import { ALLOWED_EXTS, ALLOWED_LABEL, extOf } from '@/lib/fileSniff';
import RichTextEditor from '@/components/dashboard/RichTextEditor';

const ACCEPT = ALLOWED_EXTS.map((e) => `.${e}`).join(',');

// 바이트를 사람이 읽는 단위로.
function fmtSize(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

// 확장자 → 배지 색 톤(단순 분류). 프리셋에 존재하는 색만 사용.
function extTone(ext) {
  if (ext === 'pdf') return 'bg-danger-soft text-danger';
  if (ext === 'hwp' || ext === 'hwpx') return 'bg-trust-50 text-trust-700';
  if (ext === 'xls' || ext === 'xlsx') return 'bg-sustainability-50 text-sustainability-700';
  if (ext === 'ppt' || ext === 'pptx') return 'bg-selfreliance-50 text-selfreliance-700';
  return 'bg-ink-100 text-ink-600';
}

// ── 업로드 폼 ──
function UploadForm({ onDone }) {
  const fileRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(true);
  const [picked, setPicked] = useState(null); // { name, size }
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [rteKey, setRteKey] = useState(0); // 업로드 성공 시 에디터 리셋용

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) { setPicked(null); return; }
    if (!ALLOWED_EXTS.includes(extOf(f.name))) {
      setMsg({ tone: 'danger', text: `${ALLOWED_LABEL} 형식만 업로드할 수 있습니다.` });
      setPicked(null); if (fileRef.current) fileRef.current.value = ''; return;
    }
    setMsg(null);
    setPicked({ name: f.name, size: f.size });
    if (!title.trim()) setTitle(f.name.replace(/\.[a-z0-9]+$/i, ''));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    const file = fileRef.current?.files?.[0];
    if (!file) { setMsg({ tone: 'danger', text: '문서 파일을 선택해 주세요.' }); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (title.trim()) fd.append('title', title.trim());
      fd.append('description', description); // 서버에서 새니타이즈·빈값 처리
      fd.append('published', published ? 'true' : 'false');
      const res = await fetch('/api/resources', { method: 'POST', body: fd });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '업로드에 실패했습니다.' }); return; }
      setTitle(''); setDescription(''); setPublished(true); setPicked(null); setRteKey((k) => k + 1);
      if (fileRef.current) fileRef.current.value = '';
      setMsg({ tone: 'success', text: '업로드되었습니다.' });
      onDone();
    } catch {
      setMsg({ tone: 'danger', text: '네트워크 오류로 업로드하지 못했습니다.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-chm-lg border border-border bg-surface-warm p-5">
      <div className="text-body-sm font-bold text-ink-800">문서 업로드</div>
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <Field label="문서 파일" required hint={`${ALLOWED_LABEL} · 최대 20MB`}>
        <input
          ref={fileRef} type="file" accept={ACCEPT} onChange={onPick}
          className="block w-full text-body-sm text-ink-700 file:mr-3 file:rounded-chm-md file:border-0 file:bg-ink-100 file:px-3 file:py-2 file:text-body-sm file:font-semibold file:text-ink-700"
        />
      </Field>
      {picked && (
        <div className="text-caption text-ink-500">선택됨: <span className="font-semibold text-ink-700">{picked.name}</span> · {fmtSize(picked.size)}</div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="자료 제목" hint="비우면 파일명이 사용됩니다">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 2026 집수리 신청 서식" />
        </Field>
        <Field label="공개 여부">
          <label className="flex h-full items-center gap-2 text-body-sm text-ink-700">
            <Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />
            {published ? '공개' : '비공개'}
          </label>
        </Field>
      </div>
      <Field label="설명(선택)" hint="굵게·목록·링크 등 서식을 넣을 수 있습니다">
        <RichTextEditor key={rteKey} value="" onChange={setDescription} placeholder="예: 집수리 서비스 신청 시 작성하는 표준 서식입니다." minHeight={130} />
      </Field>
      <div className="flex justify-end">
        <Button type="submit" tone="primary" loading={uploading}>업로드</Button>
      </div>
    </form>
  );
}

// ── 자료 카드(메타 편집 + 삭제) ──
function ResourceItem({ doc, onChanged }) {
  const [title, setTitle] = useState(doc.title);
  const [description, setDescription] = useState(doc.description || '');
  const [published, setPublished] = useState(doc.published);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const dirty = title !== doc.title || description !== (doc.description || '') || published !== doc.published;

  const save = async () => {
    if (!title.trim()) { setMsg({ tone: 'danger', text: '제목을 입력해 주세요.' }); return; }
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`/api/resources/${doc.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, published }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '저장 실패' }); return; }
      setMsg({ tone: 'success', text: '저장되었습니다.' });
      onChanged();
    } finally { setBusy(false); }
  };
  const remove = async () => {
    if (!confirm('이 자료를 삭제할까요?')) return;
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`/api/resources/${doc.id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setMsg({ tone: 'danger', text: d.error || '삭제 실패' }); return; }
      onChanged();
    } finally { setBusy(false); }
  };

  return (
    <div className="flex flex-col gap-3 rounded-chm-lg border border-border bg-surface p-5">
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 flex-none place-items-center rounded-chm-md text-caption font-bold uppercase ${extTone(doc.ext)}`}>{doc.ext}</span>
        <div className="min-w-0 flex-1">
          <a href={`/api/resources/${doc.id}/download`} className="block truncate text-body-sm font-semibold text-primary hover:underline">{doc.filename}</a>
          <div className="text-caption text-ink-500">{fmtSize(doc.size)} · {new Date(doc.createdAt).toLocaleDateString('ko-KR')}</div>
        </div>
        {!doc.published && <span className="flex-none rounded bg-ink-100 px-2 py-0.5 text-caption text-ink-500">비공개</span>}
      </div>
      <Field label="자료 제목"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="설명"><RichTextEditor value={doc.description || ''} onChange={setDescription} placeholder="설명(선택)" minHeight={110} /></Field>
      <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
        <label className="flex items-center gap-2 text-body-sm text-ink-700">
          <Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />
          {published ? '공개' : '비공개'}
        </label>
        <div className="flex gap-2">
          <Button size="sm" tone="primary" onClick={save} disabled={!dirty || busy}>저장</Button>
          <Button size="sm" variant="soft" tone="danger" onClick={remove} disabled={busy}>삭제</Button>
        </div>
      </div>
    </div>
  );
}

export default function ResourceManager({ resources }) {
  const router = useRouter();
  const refresh = () => router.refresh();
  return (
    <div className="flex flex-col gap-6">
      <UploadForm onDone={refresh} />
      {resources.length === 0 ? (
        <div className="text-body-sm text-ink-500">등록된 자료가 없습니다.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {resources.map((doc) => (
            <ResourceItem key={doc.id} doc={doc} onChanged={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}
