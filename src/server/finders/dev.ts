import { Dev } from "@/models/dev";
import { FindFirstArgs, FindManyArgs } from "@/server/finders";
import { db } from "@/server/lib/prismadb";
import { Prisma } from "@prisma/client";

const devArgs = {
  include: {
    user: true,
    likes: true,
    idea: { select: { id: true, title: true } },
  },
} satisfies Prisma.DevelopmentDefaultArgs;

const convertDev = (
  raw: Prisma.DevelopmentGetPayload<typeof devArgs>,
  loggedInUserId: string | undefined
): Dev => {
  const idea = raw.idea ? { id: raw.idea.id, title: raw.idea.title } : null;
  const dev: Dev = {
    id: raw.id,
    title: raw.title,
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
    // ログインユーザーがいいねしているか
    likedByLoggedInUser: raw.likes.find(
      (like) => like.userId === loggedInUserId
    )
      ? true
      : false,
    createdAt: raw.createdAt.toUTCString(),
    updatedAt: raw.updatedAt.toUTCString(),
    status: raw.status,
    allowOtherUserMemos: raw.allowOtherUserMemos,
  };

  return dev;
};

type FindDevsArgs = FindManyArgs<
  "development",
  { loggedInUserId: string | undefined }
>;

export const findManyDevs = async ({
  orderBy,
  loggedInUserId,
  ...args
}: FindDevsArgs): Promise<Dev[]> => {
  const rawDevs = await db.development.findMany({
    orderBy: { createdAt: "desc", ...orderBy },
    ...args,
    ...devArgs,
  });

  const devs = rawDevs.map((raw) => {
    return convertDev(raw, loggedInUserId);
  });

  return devs;
};

type FindDevArgs = FindFirstArgs<
  "development",
  { loggedInUserId: string | undefined }
>;

export const findDev = async ({
  loggedInUserId,
  ...args
}: FindDevArgs): Promise<Dev | undefined> => {
  const rawDev = await db.development.findFirst({
    ...args,
    ...devArgs,
  });

  if (!rawDev) {
    return undefined;
  }

  const dev = convertDev(rawDev, loggedInUserId);
  return dev;
};
