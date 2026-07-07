import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

// Edge 미들웨어 — authConfig의 authorized 콜백으로 /dashboard 접근을 통제.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/dashboard/:path*'],
};
