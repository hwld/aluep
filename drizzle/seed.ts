import * as schema from "@/server/dbSchema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { cwd } from "process";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(cwd());
const connection = postgres(process.env.DATABASE_URL || "", { max: 1 });
const db = drizzle(connection, {
  schema,
});

function upsertIdeaTags(tx: typeof db) {
  const tags = [
    "Webアプリ",
    "Webフロントエンド",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vue.js",
    "Nuxt.js",
    "Angular",
    "Svelte",
    "Webバックエンド",
    "Java",
    "Spring Boot",
    "PHP",
    "Laravel",
    "Ruby",
    "Ruby on Rails",
    "Python",
    "Django",
    "Flask",
    "Go",
    "Rust",
    "スマホアプリ",
    "Swift",
    "Kotlin",
    "Flutter",
    "React Native",
    "デスクトップアプリ",
    "C#",
    "C",
    "C++",
  ];

  return tx
    .insert(schema.ideaTags)
    .values(tags.map((tag) => ({ name: tag })))
    .onConflictDoNothing({ target: schema.ideaTags.name });
}

async function main() {
  await db.transaction(async (tx) => {
    await upsertIdeaTags(tx);
  });
}

main()
  .then(async () => {
    console.log("success");
    connection.end();
  })
  .catch((e) => {
    console.error(e);
    connection.end();
    process.exit(1);
  });
