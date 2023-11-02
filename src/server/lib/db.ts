import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import * as schema from "@/server/dbSchema";

let connection: Sql<{}>;

if (process.env.NODE_ENV === "production") {
  connection = postgres(process.env.DATABASE_URL || "");
} else {
  let globalConnection = global as typeof globalThis & {
    connection: Sql<{}>;
  };

  if (!globalConnection.connection) {
    globalConnection.connection = postgres(process.env.DATABASE_URL || "");
  }

  connection = globalConnection.connection;
}

export const db = drizzle(connection, { schema });
