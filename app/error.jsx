'use client';

import { useEffect } from 'react';
import { reportError } from '@/lib/reportError';

// 페이지 렌더 실패 시 조각·빈 화면 대신 표시되는 일반 폴백.
export default function GlobalError({ error, reset }) {
  useEffect(() => { reportError(error); }, [error]);
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem', textAlign: 'center', fontFamily: 'var(--chm-font-sans, sans-serif)' }}>
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2c3540' }}>화면을 불러오지 못했습니다</h1>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7a8b' }}>일시적인 문제일 수 있습니다. 잠시 후 다시 시도해 주세요.</p>
        <button
          onClick={() => reset()}
          style={{ marginTop: '1rem', height: 40, padding: '0 1.25rem', borderRadius: 10, background: '#2e75b6', color: '#fff', fontWeight: 600, border: 0, cursor: 'pointer' }}
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
