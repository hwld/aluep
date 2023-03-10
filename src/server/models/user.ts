import { Prisma } from "@prisma/client";
import { db } from "../lib/prismadb";

export type User = {
  id: string;
  name: string | null;
  image: string | null;
  profile: string | null;
};

const userArgs = {
  select: { id: true, name: true, image: true, profile: true },
} satisfies Prisma.UserArgs;

type FindUserArgs = Omit<Prisma.UserFindFirstArgs, keyof Prisma.UserArgs>;
export const findUser = async (
  args: FindUserArgs
): Promise<User | undefined> => {
  const rawUser = await db.user.findFirst({ ...args, ...userArgs });
  if (!rawUser) {
    return undefined;
  }

  return rawUser;
};

type FindManyUsersArgs = Omit<Prisma.UserFindManyArgs, keyof Prisma.UserArgs>;
export const findManyUsers = async (
  args: FindManyUsersArgs
): Promise<User[]> => {
  const rawUsers = await db.user.findMany({ ...args, ...userArgs });
  return rawUsers;
};

// ユーザー情報と投稿したお題のいいね数
export type UserAndThemeLikes = User & { themeLikes: number };
// ユーザー情報と開発者としてのいいね数
export type UserAndDeveloperLikes = User & { developerLikes: number };
