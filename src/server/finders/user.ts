import { User } from "@/models/user";
import { FindFirstArgs, FindManyArgs } from "@/server/finders";
import { db } from "@/server/lib/prismadb";
import { Prisma } from "@prisma/client";

const userArgs = {
  select: {
    id: true,
    name: true,
    image: true,
    profile: true,
    welcomeMessageHidden: true,
  },
} satisfies Prisma.UserDefaultArgs;

export const convertUser = (
  rawUser: Prisma.UserGetPayload<typeof userArgs>
): User => {
  return {
    id: rawUser.id,
    image: rawUser.image,
    name: rawUser.name,
    profile: rawUser.profile,
    welcomeMessageHidden: rawUser.welcomeMessageHidden,
  };
};

type FindUserArgs = FindFirstArgs<typeof db.user>;

export const findUser = async (
  args: FindUserArgs
): Promise<User | undefined> => {
  const rawUser = await db.user.findFirst({ ...args, ...userArgs });
  if (!rawUser) {
    return undefined;
  }

  return rawUser;
};

type FindManyUsersArgs = FindManyArgs<typeof db.user>;
export const findManyUsers = async (
  args: FindManyUsersArgs
): Promise<User[]> => {
  const rawUsers = await db.user.findMany({ ...args, ...userArgs });
  return rawUsers;
};

// ユーザー情報と投稿したお題のいいね数
export type UserAndIdeaLikes = User & { ideaLikes: number };
// ユーザー情報と開発者としてのいいね数
export type UserAndDevLikes = User & { devLikes: number };
