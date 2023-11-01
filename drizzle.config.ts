import type { Config } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";
import { cwd } from "process";
import { DATABASE_URL } from "@/../drizzle/standaloneEnv";

loadEnvConfig(cwd());

export default {
  schema: "./src/server/dbSchema/*",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
} satisfies Config;
