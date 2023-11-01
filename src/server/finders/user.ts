import { User } from "@/models/user";
import { DbArgs, DbPayload, __new_db__ } from "@/server/lib/db";

type FindFirstArgs = DbArgs<"users", "findFirst">;
type FindManyArgs = DbArgs<"users", "findMany">;
const userArgs = {
  columns: {
    id: true,
    name: true,
    image: true,
    profile: true,
    welcomeMessageHidden: true,
  },
} satisfies FindFirstArgs;

type Payload = DbPayload<
  typeof __new_db__.query.users.findFirst<typeof userArgs>
>;

export const convertUser = (raw: Payload): User => {
  return {
    id: raw.id,
    image: raw.image,
    name: raw.name,
    profile: raw.profile,
    welcomeMessageHidden: raw.welcomeMessageHidden,
  };
};

export const findUser = async (
  args: FindFirstArgs
): Promise<User | undefined> => {
  const raw = await __new_db__.query.users.findFirst({ ...args, ...userArgs });
  if (!raw) {
    return undefined;
  }

  const user = convertUser(raw);
  return user;
};

export const findManyUsers = async (args: FindManyArgs): Promise<User[]> => {
  const raws = await __new_db__.query.users.findMany({ ...args, ...userArgs });
  const users = raws.map(convertUser);

  return users;
};

// ユーザー情報と投稿したお題のいいね数
export type UserAndIdeaLikes = User & { ideaLikes: number };
// ユーザー情報と開発者としてのいいね数
export type UserAndDevLikes = User & { devLikes: number };
