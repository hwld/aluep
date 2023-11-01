import { ideas } from "@/server/dbSchema/ideas";
import { users } from "@/server/dbSchema/users";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const ideaLikes = pgTable(
  "idea_likes",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    ideaId: text("ideaId")
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdIdeaIdKey: uniqueIndex("idea_likes_userId_ideaId_key").on(
        table.ideaId,
        table.userId
      ),
    };
  }
);

export const ideaLikesRelations = relations(ideaLikes, ({ one }) => ({
  idea: one(ideas, { fields: [ideaLikes.ideaId], references: [ideas.id] }),
}));
