import { PrismaClient } from '@prisma/client';

// 개발 중 HMR로 인한 커넥션 폭증 방지를 위한 싱글턴.
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
