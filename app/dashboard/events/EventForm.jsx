'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, Input, Textarea, Switch, Button, Alert } from '@chm/design-system';

export default function EventForm({ event }) {
  const router = useRouter();
  const editing = !!event;
  const [title, setTitle] = useState(event?.title || '');
  const [location, setLocation] = useState(event?.location || '');
  const [startAt, setStartAt] = useState(event?.startAt || ''); // "YYYY-MM-DDTHH:mm"
  const [endAt, setEndAt] = useState(event?.endAt || '');
  const [description, setDescription] = useState(event?.description || '');
  const [published, setPublished] = useState(event ? event.published : true);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!title.trim() || !description.trim()) { setMsg({ tone: 'danger', text: '행사명과 안내 내용을 입력해 주세요.' }); return; }
    if (!startAt) { setMsg({ tone: 'danger', text: '시작 일시를 입력해 주세요.' }); return; }
    if (endAt && endAt < startAt) { setMsg({ tone: 'danger', text: '종료 일시가 시작보다 빠를 수 없습니다.' }); return; }
    setSaving(true);
    const url = editing ? `/api/events/${event.id}` : '/api/events';
    try {
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, location, startAt, endAt, description, published }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '저장에 실패했습니다.' }); return; }
      router.push('/dashboard/events');
      router.refresh();
    } catch {
      setMsg({ tone: 'danger', text: '네트워크 오류로 저장하지 못했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex max-w-2xl flex-col gap-5">
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      <Field label="행사명" required>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 집수리 교실 3기 모집 설명회" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="시작 일시" required>
          <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
        </Field>
        <Field label="종료 일시(선택)">
          <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
        </Field>
      </div>
      <Field label="장소(선택)">
        <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="예: 어은동 주민센터 2층" />
      </Field>
      <Field label="안내 내용" required hint="줄바꿈은 그대로 표시됩니다">
        <Textarea rows={8} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="행사 안내 내용을 입력하세요" />
      </Field>
      <div className="flex items-center gap-3 rounded-chm-lg border border-border p-4">
        <Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />
        <div>
          <div className="text-body-sm font-semibold text-ink-800">{published ? '공개' : '비공개(임시저장)'}</div>
          <div className="text-caption text-ink-500">공개하면 사이트 행사 페이지에 노출됩니다.</div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" tone="primary" loading={saving}>{editing ? '수정 저장' : '등록'}</Button>
        <Button type="button" variant="ghost" tone="ink" onClick={() => router.push('/dashboard/events')}>취소</Button>
      </div>
    </form>
  );
}
