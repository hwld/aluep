DO $$ BEGIN
 CREATE TYPE "DevelopmentStatus" AS ENUM('COMPLETED', 'ABORTED', 'IN_PROGRESS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"refresh_token_expires_in" integer,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "development_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"developmentId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "development_memos" (
	"id" text PRIMARY KEY NOT NULL,
	"parentCommentId" text,
	"fromUserId" text NOT NULL,
	"developmentId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "developments" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"ideaId" text,
	"githubUrl" text NOT NULL,
	"comment" text NOT NULL,
	"developedItemUrl" text NOT NULL,
	"allowOtherUserMemos" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL,
	"status" "DevelopmentStatus" DEFAULT 'IN_PROGRESS' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "favorite_users" (
	"favoriteByUserId" text NOT NULL,
	"favoritedUserId" text NOT NULL,
	CONSTRAINT favorite_users_favoriteByUserId_favoritedUserId PRIMARY KEY("favoriteByUserId","favoritedUserId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "idea_comment_parent_child" (
	"parentCommentId" text,
	"childCommentId" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "idea_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"ideaId" text NOT NULL,
	"fromUserId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "idea_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"ideaId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "idea_tag_on_ideas" (
	"ideaId" text NOT NULL,
	"tagId" text NOT NULL,
	CONSTRAINT idea_tag_on_ideas_ideaId_tagId PRIMARY KEY("ideaId","tagId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "idea_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ideas" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommended_ideas" (
	"ideaId" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionToken" text NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp(3),
	"image" text,
	"profile" text,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) DEFAULT now() NOT NULL,
	"welcomeMessageHidden" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "accounts_provider_providerAccountId_key" ON "accounts" ("provider","providerAccountId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "development_likes_userId_developmentId_key" ON "development_likes" ("developmentId","userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "development_memos_parentCommentId_key" ON "development_memos" ("parentCommentId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "developments_userId_ideaId_key" ON "developments" ("userId","ideaId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idea_likes_userId_ideaId_key" ON "idea_likes" ("ideaId","userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idea_tags_name_key" ON "idea_tags" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "sessions_sessionToken_key" ON "sessions" ("sessionToken");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "verification_tokens_token_key" ON "verification_tokens" ("token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "verification_tokens_identifier_token_key" ON "verification_tokens" ("identifier","token");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "development_likes" ADD CONSTRAINT "development_likes_developmentId_developments_id_fk" FOREIGN KEY ("developmentId") REFERENCES "developments"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "development_likes" ADD CONSTRAINT "development_likes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "development_memos" ADD CONSTRAINT "development_memos_fromUserId_users_id_fk" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "development_memos" ADD CONSTRAINT "development_memos_developmentId_developments_id_fk" FOREIGN KEY ("developmentId") REFERENCES "developments"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "development_memos" ADD CONSTRAINT "development_memos_parentCommentId_development_memos_id_fk" FOREIGN KEY ("parentCommentId") REFERENCES "development_memos"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "developments" ADD CONSTRAINT "developments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "developments" ADD CONSTRAINT "developments_ideaId_ideas_id_fk" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorite_users" ADD CONSTRAINT "favorite_users_favoriteByUserId_users_id_fk" FOREIGN KEY ("favoriteByUserId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "favorite_users" ADD CONSTRAINT "favorite_users_favoritedUserId_users_id_fk" FOREIGN KEY ("favoritedUserId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "idea_comment_parent_child" ADD CONSTRAINT "idea_comment_parent_child_parentCommentId_idea_comments_id_fk" FOREIGN KEY ("parentCommentId") REFERENCES "idea_comments"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "idea_comment_parent_child" ADD CONSTRAINT "idea_comment_parent_child_childCommentId_idea_comments_id_fk" FOREIGN KEY ("childCommentId") REFERENCES "idea_comments"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "idea_comments" ADD CONSTRAINT "idea_comments_ideaId_ideas_id_fk" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "idea_comments" ADD CONSTRAINT "idea_comments_fromUserId_users_id_fk" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "idea_likes" ADD CONSTRAINT "idea_likes_ideaId_ideas_id_fk" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "idea_likes" ADD CONSTRAINT "idea_likes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "idea_tag_on_ideas" ADD CONSTRAINT "idea_tag_on_ideas_ideaId_ideas_id_fk" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "idea_tag_on_ideas" ADD CONSTRAINT "idea_tag_on_ideas_tagId_idea_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "idea_tags"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ideas" ADD CONSTRAINT "ideas_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recommended_ideas" ADD CONSTRAINT "recommended_ideas_ideaId_ideas_id_fk" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
