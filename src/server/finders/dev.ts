import { Dev } from "@/models/dev";
import { db } from "@/server/lib/prismadb";
import { OmitStrict } from "@/types/OmitStrict";
import { Prisma } from "@prisma/client";

const devArgs = {
  include: {
    user: true,
    likes: true,
    idea: { select: { title: true } },
  },
} satisfies Prisma.DevelopmentDefaultArgs;

const convertDev = (
  raw: Prisma.DevelopmentGetPayload<typeof devArgs>,
  loggedInUserId: string | undefined
): Dev => {
  const dev: Dev = {
    id: raw.id,
    ideaId: raw.ideaId,
    ideaTitle: raw.idea.title,
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

export type FindDevsArgs = OmitStrict<
  Prisma.DevelopmentFindManyArgs,
  "include" | "select"
> & {
  loggedInUserId: string | undefined;
};
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

export const findDev = async (
  devId: string,
  loggedInUserId: string | undefined
): Promise<Dev | undefined> => {
  const rawDev = await db.development.findUnique({
    where: { id: devId },
    ...devArgs,
  });

  if (!rawDev) {
    return undefined;
  }

  const dev = convertDev(rawDev, loggedInUserId);
  return dev;
};
