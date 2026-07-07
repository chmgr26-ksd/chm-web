// Edge 호환 인증 설정(미들웨어에서 사용) — Prisma/bcrypt 등 Node 전용 코드는 포함하지 않음.
// 실제 자격증명 검증(authorize)은 auth.js(Node 런타임)에서 providers로 주입.

/** @type {import('next-auth').NextAuthConfig} */
export const authConfig = {
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    // 라우트 접근 권한 — 미들웨어가 이 콜백으로 판단.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const path = nextUrl.pathname;

      // 대시보드(업무 플랫폼)는 직원·관리자만
      if (path.startsWith('/dashboard')) {
        if (!isLoggedIn) return false; // → 로그인 페이지로
        if (role !== 'ADMIN' && role !== 'STAFF') {
          return Response.redirect(new URL('/', nextUrl)); // 권한 없음 → 홈
        }
        return true;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
};
