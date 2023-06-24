import { User } from "@/models/user";
import { db } from "@/server/lib/prismadb";
import { Prisma } from "@prisma/client";

const userArgs = {
  select: { id: true, name: true, image: true, profile: true },
} satisfies Prisma.UserArgs;

export const convertUser = (
  rawUser: Prisma.UserGetPayload<typeof userArgs>
): User => {
  return {
    id: rawUser.id,
    image: rawUser.image,
    name: rawUser.name,
    profile: rawUser.profile,
  };
};

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
export type UserAndIdeaLikes = User & { ideaLikes: number };
// ユーザー情報と開発者としてのいいね数
export type UserAndDevelopmentLikes = User & { developmentLikes: number };
