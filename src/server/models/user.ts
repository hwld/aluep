import { User } from "@prisma/client";

export type AppUser = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  profile: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// ユーザー情報と投稿したお題のいいね数
export type UserAndThemeLikes = User & { themeLikes: number };
// ユーザー情報と開発者としてのいいね数
export type UserAndDeveloperLikes = User & { developerLikes: number };
