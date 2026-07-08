import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/auth.config';
import { rateLimit, clientIp } from '@/lib/rateLimit';

// 전체 인증 설정(Node 런타임) — Credentials 검증에 Prisma·bcrypt 사용.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    // Edge용 동기 jwt(역할 주입)를 실행한 뒤, Node 런타임에서 최신 역할을 DB로 재확인.
    // → 관리자가 권한을 변경/회수하면 다음 요청부터 즉시 반영(강등 계정 방치 제거).
    async jwt(params) {
      const token = authConfig.callbacks.jwt(params);
      if (token?.id) {
        try {
          const fresh = await prisma.user.findUnique({
            where: { id: token.id },
            select: { role: true },
          });
          // 삭제된 계정 → 역할 제거(RBAC의 can/isLoggedIn이 거부). 없으면 최신 역할 반영.
          token.role = fresh ? fresh.role : undefined;
        } catch {
          /* DB 일시 오류 → 기존 토큰 유지(가용성 우선) */
        }
      }
      return token;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      authorize: async (credentials, request) => {
        // 무차별 대입 방지 — IP당 분당 10회(IP 식별 불가 시 스킵).
        const ip = request?.headers?.get ? clientIp(request) : 'unknown';
        if (ip !== 'unknown') {
          const rl = rateLimit(`login:${ip}`, { max: 10, windowMs: 60_000 });
          if (!rl.ok) return null;
        }

        const email = credentials?.email ? String(credentials.email).toLowerCase().trim() : '';
        const password = credentials?.password ? String(credentials.password) : '';
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        // 손상된/무효 해시(평문 삽입 등)면 bcrypt가 예외를 던짐 →
        // Configuration 오류 대신 "로그인 실패(null)"로 안전하게 처리.
        let ok = false;
        try {
          ok = await bcrypt.compare(password, user.passwordHash);
        } catch {
          return null;
        }
        if (!ok) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});
