import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { loadEnvConfig } from "@next/env";
import { cwd } from "process";

async function main() {
  loadEnvConfig(cwd());
  const connection = postgres(process.env.DATABASE_URL || "", { max: 1 });
  const db = drizzle(connection);
  await migrate(db, { migrationsFolder: "drizzle/migrations" });
}

main()
  .then(() => {
    console.log("success");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
