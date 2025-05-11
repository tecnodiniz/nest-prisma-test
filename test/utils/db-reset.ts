import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resetDb = async () => {
  const tables = await prisma.$queryRaw<{ tablename: string }[]>(
    Prisma.sql`SELECT tablename FROM pg_tables WHERE schemaname='public'`,
  );

  for (const { tablename } of tables) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE`,
      );
    }
  }
};
