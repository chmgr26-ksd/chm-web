// 초기 관리자 부트스트랩 시드.
// 사용: ADMIN_EMAIL=you@chm.kr ADMIN_PASSWORD='강한비번' ADMIN_NAME=김수동 npx prisma db seed
// (이미 있으면 role만 ADMIN으로 갱신)
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || '';
  const name = process.env.ADMIN_NAME || '관리자';

  if (!email || !password) {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD 미설정 — 관리자 시드를 건너뜁니다.');
    return;
  }
  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD는 8자 이상이어야 합니다.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN' },
    create: { email, name, passwordHash, role: 'ADMIN' },
  });
  console.log(`✓ 관리자 계정 준비 완료: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
