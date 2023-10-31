import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import * as schema from "@/server/dbSchema";

// TODO
const DATABASE_URL = process.env.__NEW_DATABASE_URL__ || "";

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
export const __new_db__ = drizzle(connection, { schema });
