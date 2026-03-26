import { PrismaClient } from "@/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";
import fs from "node:fs";

function createPrismaClient(): PrismaClient {
  const dbPath =
    process.env.DATABASE_URL?.replace(/^file:/, "") ||
    path.join(process.cwd(), "dev.db");

  if (!fs.existsSync(dbPath)) {
    throw new Error(
      `Database file not found at ${dbPath}. Run "npx prisma migrate dev" first.`
    );
  }

  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
