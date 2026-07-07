'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@chm/design-system';

const OPTIONS = [
  { value: 'NEW', label: '접수' },
  { value: 'CONTACTED', label: '확인 연락' },
  { value: 'SCHEDULED', label: '일정 조율' },
  { value: 'DONE', label: '완료' },
  { value: 'CANCELED', label: '취소' },
];

export default function InquiryStatusSelect({ id, value }) {
  const router = useRouter();
  const [status, setStatus] = useState(value);
  const [saving, setSaving] = useState(false);

  const onChange = async (e) => {
    const next = e.target.value;
    const prev = status;
    setStatus(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        setStatus(prev); // 실패 시 롤백
      } else {
        router.refresh();
      }
    } catch {
      setStatus(prev);
    } finally {
      setSaving(false);
    }
  };

  return <Select size="sm" value={status} onChange={onChange} disabled={saving} options={OPTIONS} />;
}
