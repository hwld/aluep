import { Dev } from "@/models/dev";
import { DbArgs, DbPayload, __new_db__ } from "@/server/lib/db";

type FindFristArgs = DbArgs<"developments", "findFirst">;
type FindManyArgs = DbArgs<"developments", "findMany">;
const devArgs = {
  with: {
    user: true,
    likes: true,
    idea: { columns: { id: true, title: true } },
  },
} satisfies FindFristArgs;

const convertDev = (
  raw: DbPayload<
    typeof __new_db__.query.developments.findFirst<typeof devArgs>
  >,
  loggedInUserId: string | undefined
): Dev => {
  const idea = raw.idea ? { id: raw.idea.id, title: raw.idea.title } : null;

  return {
    id: raw.id,
    idea,
    developer: {
      id: raw.user.id,
      name: raw.user.name,
      imageUrl: raw.user.image,
    },
    githubUrl: raw.githubUrl,
    comment: raw.comment,
    developedItemUrl: raw.developedItemUrl,
    likes: raw.likes.length,
    likedByLoggedInUser: raw.likes.find((l) => l.userId === loggedInUserId)
      ? true
      : false,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    status: raw.status,
    allowOtherUserMemos: raw.allowOtherUserMemos,
  };
};

export const findManyDevs = async ({
  args,
  loggedInUserId,
}: {
  args: FindManyArgs;
  loggedInUserId: string | undefined;
}): Promise<Dev[]> => {
  const raws = await __new_db__.query.developments.findMany({
    ...args,
    ...devArgs,
    orderBy: (devs, { desc }) => [desc(devs.createdAt)],
  });

  const devs = raws.map((r) => convertDev(r, loggedInUserId));
  return devs;
};

export const findDev = async ({
  args,
  loggedInuserId,
}: {
  args: FindFristArgs;
  loggedInuserId: string | undefined;
}): Promise<Dev | undefined> => {
  const raw = await __new_db__.query.developments.findFirst({
    ...args,
    ...devArgs,
  });

  if (!raw) {
    return undefined;
  }

  return convertDev(raw, loggedInuserId);
};
