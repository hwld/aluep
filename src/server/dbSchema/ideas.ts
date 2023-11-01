import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "@/server/dbSchema/users";
import { ideaTagOnIdeas } from "@/server/dbSchema/ideaTagOnIdeas";
import { developments } from "@/server/dbSchema/devs";
import { ideaLikes } from "@/server/dbSchema/ideaLikes";
import { ideaComments } from "@/server/dbSchema/ideaComments";

export const ideas = pgTable("ideas", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const ideasRelations = relations(ideas, ({ many, one }) => ({
  ideaTagOnIdea: many(ideaTagOnIdeas),
  user: one(users, { fields: [ideas.userId], references: [users.id] }),
  developments: many(developments),
  likes: many(ideaLikes),
  comments: many(ideaComments),
}));

export const recommendedIdeas = pgTable("recommended_ideas", {
  ideaId: text("ideaId")
    .primaryKey()
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
});
