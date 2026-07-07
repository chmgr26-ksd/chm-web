'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@chm/design-system';
import { ROLE_VALUES, ROLE_LABEL } from '@/lib/rbac';

const OPTIONS = ROLE_VALUES.map((v) => ({ value: v, label: ROLE_LABEL[v] }));

export default function RoleSelect({ id, value }) {
  const router = useRouter();
  const [role, setRole] = useState(value);
  const [saving, setSaving] = useState(false);

  const onChange = async (e) => {
    const next = e.target.value;
    const prev = role;
    setRole(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: next }),
      });
      if (!res.ok) setRole(prev);
      else router.refresh();
    } catch {
      setRole(prev);
    } finally {
      setSaving(false);
    }
  };

  return <Select size="sm" value={role} onChange={onChange} disabled={saving} options={OPTIONS} />;
}
