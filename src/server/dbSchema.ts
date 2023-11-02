import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  pgTable,
  uniqueIndex,
  pgEnum,
  text,
  timestamp,
  boolean,
  foreignKey,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

export const developmentStatus = pgEnum("DevelopmentStatus", [
  "COMPLETED",
  "ABORTED",
  "IN_PROGRESS",
]);

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    name: text("name"),
    email: text("email"),
    emailVerified: timestamp("emailVerified", { precision: 3, mode: "string" }),
    image: text("image"),
    profile: text("profile"),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 3,
      mode: "string",
    }).notNull(),
    welcomeMessageHidden: boolean("welcomeMessageHidden")
      .default(false)
      .notNull(),
  },
  (table) => {
    return {
      emailKey: uniqueIndex("users_email_key").on(table.email),
    };
  }
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refresh_token"),
    refreshTokenExpiresIn: integer("refresh_token_expires_in"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => {
    return {
      providerProviderAccountIdKey: uniqueIndex(
        "accounts_provider_providerAccountId_key"
      ).on(table.provider, table.providerAccountId),
    };
  }
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    sessionToken: text("sessionToken").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    expires: timestamp("expires", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      sessionTokenKey: uniqueIndex("sessions_sessionToken_key").on(
        table.sessionToken
      ),
    };
  }
);

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
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
});

export const ideasRelations = relations(ideas, ({ one }) => ({
  user: one(users, { fields: [ideas.userId], references: [users.id] }),
}));

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
    }).notNull(),
  },
  (table) => {
    return {
      nameKey: uniqueIndex("idea_tags_name_key").on(table.name),
    };
  }
);

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

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      tokenKey: uniqueIndex("verification_tokens_token_key").on(table.token),
      identifierTokenKey: uniqueIndex(
        "verification_tokens_identifier_token_key"
      ).on(table.identifier, table.token),
    };
  }
);

export const developmentLikes = pgTable(
  "development_likes",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    developmentId: text("developmentId")
      .notNull()
      .references(() => developments.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdDevelopmentIdKey: uniqueIndex(
        "development_likes_userId_developmentId_key"
      ).on(table.developmentId, table.userId),
    };
  }
);

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

export const developmentMemos = pgTable(
  "development_memos",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
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
    }).notNull(),
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

export const recommendedIdeas = pgTable("recommended_ideas", {
  ideaId: text("ideaId")
    .primaryKey()
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
});

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
