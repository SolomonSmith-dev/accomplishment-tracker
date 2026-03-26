import path from "node:path";
import { defineConfig } from "prisma/config";

const dbPath = path.join(__dirname, "dev.db");

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: `file:${dbPath}`,
  },
  migrate: {
    adapter: async () => {
      const { PrismaBetterSqlite3 } = await import(
        "@prisma/adapter-better-sqlite3"
      );
      return new PrismaBetterSqlite3({ url: dbPath });
    },
  },
});
