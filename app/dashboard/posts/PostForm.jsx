'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, Input, Textarea, Select, Switch, Button, Alert } from '@chm/design-system';
import { POST_CATEGORY, POST_CATEGORY_VALUES } from '@/lib/posts';

const CAT_OPTIONS = POST_CATEGORY_VALUES.map((v) => ({ value: v, label: POST_CATEGORY[v].label }));

export default function PostForm({ post }) {
  const router = useRouter();
  const editing = !!post;
  const [category, setCategory] = useState(post?.category || 'NOTICE');
  const [title, setTitle] = useState(post?.title || '');
  const [body, setBody] = useState(post?.body || '');
  const [published, setPublished] = useState(post ? post.published : true);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    const url = editing ? `/api/posts/${post.id}` : '/api/posts';
    try {
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, title, body, published }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '저장에 실패했습니다.' }); return; }
      router.push('/dashboard/posts');
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
      <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
        <Field label="카테고리">
          <Select value={category} onChange={(e) => setCategory(e.target.value)} options={CAT_OPTIONS} />
        </Field>
        <Field label="제목" required>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="소식 제목" />
        </Field>
      </div>
      <Field label="내용" required hint="줄바꿈은 그대로 표시됩니다">
        <Textarea rows={12} value={body} onChange={(e) => setBody(e.target.value)} placeholder="소식 내용을 입력하세요" />
      </Field>
      <div className="flex items-center gap-3 rounded-chm-lg border border-border p-4">
        <Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />
        <div>
          <div className="text-body-sm font-semibold text-ink-800">{published ? '공개' : '비공개(임시저장)'}</div>
          <div className="text-caption text-ink-500">공개하면 사이트 소식 페이지에 노출됩니다.</div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" tone="primary" loading={saving}>{editing ? '수정 저장' : '작성'}</Button>
        <Button type="button" variant="ghost" tone="ink" onClick={() => router.push('/dashboard/posts')}>취소</Button>
      </div>
    </form>
  );
}
