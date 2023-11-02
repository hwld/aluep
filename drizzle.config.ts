import type { Config } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";
import { cwd } from "process";

loadEnvConfig(cwd());

export default {
  schema: "./src/server/dbSchema.ts",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
} satisfies Config;
