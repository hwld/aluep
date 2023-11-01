import { ideas } from "@/server/dbSchema/ideas";
import { users } from "@/server/dbSchema/users";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const ideaComments = pgTable("idea_comments", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  ideaId: text("ideaId")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade", onUpdate: "cascade" }),
  fromUserId: text("fromUserId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  text: text("text").notNull(),
});

export const ideaCommentsRelations = relations(ideaComments, ({ one }) => ({
  idea: one(ideas, { fields: [ideaComments.ideaId], references: [ideas.id] }),
}));
