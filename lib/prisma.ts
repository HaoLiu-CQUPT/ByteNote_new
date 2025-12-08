import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// 在开发环境下，如果 Prisma 客户端已存在，先断开连接
if (process.env.NODE_ENV !== "production" && globalForPrisma.prisma) {
  globalForPrisma.prisma.$disconnect();
  delete globalForPrisma.prisma;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}