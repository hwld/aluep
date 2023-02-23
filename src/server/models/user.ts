import { User } from "@prisma/client";

// ユーザー情報と投稿したお題のいいね数
export type UserAndThemeLikes = User & { themeLikes: number };
// ユーザー情報と開発者としてのいいね数
export type UserAndDeveloperLikes = User & { developerLikes: number };
