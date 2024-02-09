import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? process.env.NODE_ENV === "development"
    ? (new PrismaClient().$extends({
        query: {
          $allModels: {
            async $allOperations({ query, args }) {
              // 少し遅くする
              await new Promise((resolve) => setTimeout(resolve, 200));
              return query(args);
            },
          },
        },
      }) as PrismaClient)
    : new PrismaClient();

// ホットリロードによって新しいインスタンスが作成されないよう、グローバル変数に格納する
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
