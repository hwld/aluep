import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { loadEnvConfig } from "@next/env";
import { cwd } from "process";
import { DATABASE_URL } from "@/../drizzle/standaloneEnv";

loadEnvConfig(cwd());
const connection = postgres(DATABASE_URL, { max: 1 });
const db = drizzle(connection);

async function main() {
  await migrate(db, { migrationsFolder: "drizzle/migrations" });
}

main()
  .then(() => {
    console.log("success");
    connection.end();
  })
  .catch((e) => {
    console.error(e);
    connection.end();
    process.exit(1);
  });
