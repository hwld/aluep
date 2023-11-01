import { users } from "@/server/dbSchema/users";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

export const favoriteUsers = pgTable(
  "favorite_users",
  {
    favoriteByUserId: text("favoriteByUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    favoritedUserId: text("favoritedUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      favoriteUsersPkey: primaryKey(
        table.favoriteByUserId,
        table.favoritedUserId
      ),
    };
  }
);
