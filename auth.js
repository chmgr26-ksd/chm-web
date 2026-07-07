import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/auth.config';

// 전체 인증 설정(Node 런타임) — Credentials 검증에 Prisma·bcrypt 사용.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      authorize: async (credentials) => {
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
