import { ideas } from "@/server/dbSchema/ideas";
import { ideaTags } from "@/server/dbSchema/ideaTags";
import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

export const ideaTagOnIdeas = pgTable(
  "idea_tag_on_ideas",
  {
    ideaId: text("ideaId")
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade", onUpdate: "cascade" }),
    tagId: text("tagId")
      .notNull()
      .references(() => ideaTags.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      ideaTagOnIdeasPkey: primaryKey(table.ideaId, table.tagId),
    };
  }
);

export const ideaTagOnIdeasRelations = relations(ideaTagOnIdeas, ({ one }) => ({
  idea: one(ideas, {
    fields: [ideaTagOnIdeas.ideaId],
    references: [ideas.id],
  }),
  ideaTag: one(ideaTags, {
    fields: [ideaTagOnIdeas.tagId],
    references: [ideaTags.id],
  }),
}));
