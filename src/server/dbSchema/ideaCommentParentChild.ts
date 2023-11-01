import { ideaComments } from "@/server/dbSchema/ideaComments";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const ideaCommentParentChild = pgTable("idea_comment_parent_child", {
  parentCommentId: text("parentCommentId").references(() => ideaComments.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  childCommentId: text("childCommentId")
    .primaryKey()
    .notNull()
    .references(() => ideaComments.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const ideaCommentParentChildRelations = relations(
  ideaCommentParentChild,
  ({ one }) => ({
    parentComment: one(ideaComments, {
      fields: [ideaCommentParentChild.parentCommentId],
      references: [ideaComments.id],
      relationName: "asParent",
    }),

    childComment: one(ideaComments, {
      fields: [ideaCommentParentChild.childCommentId],
      references: [ideaComments.id],
      relationName: "asChild",
    }),
  })
);
