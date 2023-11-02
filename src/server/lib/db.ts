import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import * as schema from "@/server/dbSchema";
import { BuildQueryResult, DBQueryConfig } from "drizzle-orm";
import { PgRelationalQuery } from "drizzle-orm/pg-core/query-builders/query";
import { OmitStrict } from "@/types/OmitStrict";

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

type Schema = NonNullable<typeof db._.schema>;
type TableName = keyof Schema;
type Args<T extends TableName> = DBQueryConfig<"many", true, Schema, Schema[T]>;
type Payload<
  T extends TableName,
  Args extends Record<string, unknown>
> = Awaited<PgRelationalQuery<BuildQueryResult<Schema, Schema[T], Args>>>;

type SelectKey = Extract<"columns" | "with", keyof Args<any>>;
const baseArgs = { with: { user: true } } satisfies Pick<
  Args<"ideas">,
  SelectKey
>;

const convert = (raw: Payload<"ideas", typeof baseArgs>) => {
  return raw;
};

const _find = async (args: OmitStrict<Args<"ideas">, SelectKey>) => {
  const raws = await db.query.ideas.findMany({ ...args, ...baseArgs });

  const data = raws.map(convert);
  return data;
};
