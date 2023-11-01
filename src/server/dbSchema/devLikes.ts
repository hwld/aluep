import { developments } from "@/server/dbSchema/devs";
import { users } from "@/server/dbSchema/users";
import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const developmentLikes = pgTable(
  "development_likes",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    developmentId: text("developmentId")
      .notNull()
      .references(() => developments.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdDevelopmentIdKey: uniqueIndex(
        "development_likes_userId_developmentId_key"
      ).on(table.developmentId, table.userId),
    };
  }
);
