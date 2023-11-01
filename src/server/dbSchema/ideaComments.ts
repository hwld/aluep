import { ideaCommentParentChild } from "@/server/dbSchema/ideaCommentParentChild";
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

export const ideaCommentsRelations = relations(
  ideaComments,
  ({ one, many }) => ({
    fromUser: one(users, {
      fields: [ideaComments.fromUserId],
      references: [users.id],
    }),

    idea: one(ideas, { fields: [ideaComments.ideaId], references: [ideas.id] }),

    // oneにもrelationNameだけを設定できればいいのだが、それができないのでmanyにする。
    // ideaCommentsだけを見るとmanyが適切だと思うが、ideaCommentParentChidlの
    // これに関連するchildIdは主キーのためone-to-oneにしたいんだが・・・。

    // TODO: っていうか自己参照テーブルで良くない？
    asChild: many(ideaCommentParentChild, {
      relationName: "asChild",
    }),
    asParent: many(ideaCommentParentChild, { relationName: "asParent" }),
  })
);
