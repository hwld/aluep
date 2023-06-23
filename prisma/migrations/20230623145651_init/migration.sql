-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "refresh_token_expires_in" INTEGER,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "profile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "ideas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "idea_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_tag_on_ideas" (
    "ideaId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "idea_tag_on_ideas_pkey" PRIMARY KEY ("ideaId","tagId")
);

-- CreateTable
CREATE TABLE "idea_likes" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "githubUrl" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "developedItemUrl" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "allowOtherUserMemos" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "developments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_likes" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "development_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_statuses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "development_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_memos" (
    "id" TEXT NOT NULL,
    "memo" TEXT NOT NULL,
    "parentCommentId" TEXT,
    "fromUserId" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "development_memos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_users" (
    "favoriteByUserId" TEXT NOT NULL,
    "favoritedUserId" TEXT NOT NULL,

    CONSTRAINT "favorite_users_pkey" PRIMARY KEY ("favoriteByUserId","favoritedUserId")
);

-- CreateTable
CREATE TABLE "idea_comments" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_comment_parent_child" (
    "parentCommentId" TEXT,
    "childCommentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idea_comment_parent_child_pkey" PRIMARY KEY ("childCommentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "idea_tags_name_key" ON "idea_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idea_likes_userId_ideaId_key" ON "idea_likes"("userId", "ideaId");

-- CreateIndex
CREATE UNIQUE INDEX "developments_userId_ideaId_key" ON "developments"("userId", "ideaId");

-- CreateIndex
CREATE UNIQUE INDEX "development_likes_userId_developmentId_key" ON "development_likes"("userId", "developmentId");

-- CreateIndex
CREATE UNIQUE INDEX "development_memos_parentCommentId_key" ON "development_memos"("parentCommentId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_tag_on_ideas" ADD CONSTRAINT "idea_tag_on_ideas_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_tag_on_ideas" ADD CONSTRAINT "idea_tag_on_ideas_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "idea_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_likes" ADD CONSTRAINT "idea_likes_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_likes" ADD CONSTRAINT "idea_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developments" ADD CONSTRAINT "developments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developments" ADD CONSTRAINT "developments_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developments" ADD CONSTRAINT "developments_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "development_statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_likes" ADD CONSTRAINT "development_likes_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "developments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_likes" ADD CONSTRAINT "development_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_memos" ADD CONSTRAINT "development_memos_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "development_memos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_memos" ADD CONSTRAINT "development_memos_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_memos" ADD CONSTRAINT "development_memos_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "developments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_users" ADD CONSTRAINT "favorite_users_favoriteByUserId_fkey" FOREIGN KEY ("favoriteByUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_users" ADD CONSTRAINT "favorite_users_favoritedUserId_fkey" FOREIGN KEY ("favoritedUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_comments" ADD CONSTRAINT "idea_comments_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_comments" ADD CONSTRAINT "idea_comments_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_comment_parent_child" ADD CONSTRAINT "idea_comment_parent_child_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "idea_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_comment_parent_child" ADD CONSTRAINT "idea_comment_parent_child_childCommentId_fkey" FOREIGN KEY ("childCommentId") REFERENCES "idea_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
