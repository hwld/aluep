import { ideaTagOnIdeas } from "@/server/dbSchema/ideaTagOnIdeas";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const ideaTags = pgTable(
  "idea_tags",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 3,
      mode: "string",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      nameKey: uniqueIndex("idea_tags_name_key").on(table.name),
    };
  }
);

export const ideaTagsRelations = relations(ideaTags, ({ many }) => ({
  ideaTagOnIdeas: many(ideaTagOnIdeas),
}));
