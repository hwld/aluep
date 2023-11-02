import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import { dbSchema } from "@/server/dbSchema";

// TODO
const DATABASE_URL = process.env.DATABASE_URL || "";

let connection: Sql<{}>;
if (process.env.NODE_ENV === "production") {
  connection = postgres(DATABASE_URL);
} else {
  let globalConnection = global as typeof globalThis & {
    connection: Sql<{}>;
  };

  if (!globalConnection.connection) {
    globalConnection.connection = postgres(DATABASE_URL);
  }

  connection = globalConnection.connection;
}

// TODO:
export const __new_db__ = drizzle(connection, {
  schema: { ...dbSchema },
  logger: process.env.NODE_ENV === "development",
});

type TableName = keyof typeof __new_db__.query;

//TODO: columnsとwithだけに制限したいけどPickがうまく効かない・・・
export type DbArgs<
  T extends TableName,
  K extends "findFirst" | "findMany"
> = Parameters<(typeof __new_db__.query)[T][K]>[0];
export type DbPayload<T extends () => void> = NonNullable<
  Awaited<ReturnType<T>>
>;
