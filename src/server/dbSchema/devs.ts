import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "@/server/dbSchema/users";
import { ideas } from "@/server/dbSchema/ideas";
import { developmentLikes } from "@/server/dbSchema/devLikes";

export const developmentStatus = pgEnum("DevelopmentStatus", [
  "COMPLETED",
  "ABORTED",
  "IN_PROGRESS",
]);
export const developments = pgTable(
  "developments",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    ideaId: text("ideaId").references(() => ideas.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    githubUrl: text("githubUrl").notNull(),
    comment: text("comment").notNull(),
    developedItemUrl: text("developedItemUrl").notNull(),
    allowOtherUserMemos: boolean("allowOtherUserMemos").default(true).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 3,
      mode: "string",
    })
      .notNull()
      .defaultNow(),
    status: developmentStatus("status").default("IN_PROGRESS").notNull(),
  },
  (table) => {
    return {
      userIdIdeaIdKey: uniqueIndex("developments_userId_ideaId_key").on(
        table.userId,
        table.ideaId
      ),
    };
  }
);

export const developmentsRelations = relations(
  developments,
  ({ one, many }) => ({
    user: one(users, { fields: [developments.userId], references: [users.id] }),
    likes: many(developmentLikes),
    idea: one(ideas, { fields: [developments.ideaId], references: [ideas.id] }),
  })
);
