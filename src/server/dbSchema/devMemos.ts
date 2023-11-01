import { developments } from "@/server/dbSchema/devs";
import { users } from "@/server/dbSchema/users";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  foreignKey,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const developmentMemos = pgTable(
  "development_memos",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    // TODO: なんでcomment?
    parentCommentId: text("parentCommentId"),
    fromUserId: text("fromUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    developmentId: text("developmentId")
      .notNull()
      .references(() => developments.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    text: text("text").notNull(),
  },
  (table) => {
    return {
      parentCommentIdKey: uniqueIndex(
        "development_memos_parentCommentId_key"
      ).on(table.parentCommentId),
      developmentMemosParentCommentIdFkey: foreignKey({
        columns: [table.parentCommentId],
        foreignColumns: [table.id],
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);

export const developmentMemosRelations = relations(
  developmentMemos,
  ({ one }) => ({
    fromUser: one(users, {
      fields: [developmentMemos.fromUserId],
      references: [users.id],
    }),
  })
);
