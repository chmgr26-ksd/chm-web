'use client';

import { useEffect } from 'react';
import { reportError } from '@/lib/reportError';

// 루트 레이아웃 자체의 렌더 실패까지 포착하는 최상위 폴백(자체 html/body 필요).
export default function GlobalError({ error, reset }) {
  useEffect(() => { reportError(error); }, [error]);
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#f6f7f9' }}>
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', textAlign: 'center' }}>
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
      </body>
    </html>
  );
}
