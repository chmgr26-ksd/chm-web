'use client';

import { SessionProvider } from 'next-auth/react';

// 클라이언트 세션 컨텍스트 — 헤더 등에서 로그인 상태를 useSession으로 읽기 위함.
// 공개 페이지는 정적 유지되고, 세션은 하이드레이션 후 클라이언트에서 로드됩니다.
export default function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
