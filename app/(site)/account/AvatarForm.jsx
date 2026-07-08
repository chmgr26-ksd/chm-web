'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Avatar, Button, Alert } from '@chm/design-system';

// 중앙을 정사각형으로 잘라 지정 크기 JPEG Blob으로 변환(브라우저 처리 → 서버 부담 없음).
async function toSquareJpeg(file, size = 256, quality = 0.85) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const side = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = (bitmap.height - side) / 2;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  canvas.getContext('2d').drawImage(bitmap, sx, sy, side, side, 0, 0, size, size);
  if (bitmap.close) bitmap.close();
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
}

export default function AvatarForm({ name, image }) {
  const router = useRouter();
  const { update } = useSession();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsg(null);
    setBusy(true);
    try {
      const fd = new FormData();
      try {
        const blob = await toSquareJpeg(file);
        fd.append('file', blob || file, blob ? 'avatar.jpg' : file.name);
      } catch {
        fd.append('file', file);
      }
      const res = await fetch('/api/account/avatar', { method: 'POST', body: fd });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ tone: 'danger', text: d.error || '업로드에 실패했습니다.' }); return; }
      await update(); // 세션 image 갱신(헤더 아바타 반영)
      router.refresh();
      setMsg({ tone: 'success', text: '프로필 사진이 변경되었습니다.' });
    } catch {
      setMsg({ tone: 'danger', text: '네트워크 오류로 변경하지 못했습니다.' });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const remove = async () => {
    if (!confirm('프로필 사진을 삭제할까요?')) return;
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch('/api/account/avatar', { method: 'DELETE' });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setMsg({ tone: 'danger', text: d.error || '삭제에 실패했습니다.' }); return; }
      await update();
      router.refresh();
      setMsg({ tone: 'success', text: '프로필 사진이 삭제되었습니다.' });
    } catch {
      setMsg({ tone: 'danger', text: '네트워크 오류로 삭제하지 못했습니다.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar name={name} src={image || undefined} value="trust" size="xl" />
      <div className="flex min-w-0 flex-col gap-2">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
        <div className="flex gap-2">
          <Button size="sm" tone="primary" variant="soft" loading={busy} onClick={() => fileRef.current?.click()}>사진 변경</Button>
          {image && <Button size="sm" tone="danger" variant="ghost" disabled={busy} onClick={remove}>삭제</Button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        <p className="text-caption text-ink-500">정사각형으로 잘려 저장됩니다. 사진이 없으면 이름의 성 한 글자가 표시됩니다.</p>
      </div>
    </div>
  );
}
