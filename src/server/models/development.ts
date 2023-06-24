import { db } from "@/server/lib/prismadb";
import { DevelopmentStatus } from "@/server/models/developmentStatus";
import { OmitStrict } from "@/types/OmitStrict";
import { Prisma } from "@prisma/client";

export type Development = {
  id: string;
  ideaId: string;
  ideaTitle: string;
  developerUserId: string;
  developerUserName: string | null;
  developerUserImage: string | null;
  githubUrl: string;
  comment: string;
  developedItemUrl: string;
  likes: number;
  likedByLoggedInUser: boolean;
  createdAt: string;
  updatedAt: string;
  status: DevelopmentStatus;
  allowOtherUserMemos: boolean;
};

const developmentArgs = {
  include: {
    user: true,
    likes: true,
    status: true,
    idea: { select: { title: true } },
  },
} satisfies Prisma.DevelopmentArgs;

const convertDevelopment = (
  raw: Prisma.DevelopmentGetPayload<typeof developmentArgs>,
  loggedInUserId: string | undefined
): Development => {
  const development: Development = {
    id: raw.id,
    ideaId: raw.ideaId,
    ideaTitle: raw.idea.title,
    developerUserId: raw.user.id,
    developerUserName: raw.user.name,
    developerUserImage: raw.user.image,
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
    status: { id: raw.status.id, name: raw.status.name },
    allowOtherUserMemos: raw.allowOtherUserMemos,
  };

  return development;
};

export type FindDevelopmentsArgs = OmitStrict<
  Prisma.DevelopmentFindManyArgs,
  "include" | "select"
> & {
  loggedInUserId: string | undefined;
};
export const findManyDevelopments = async ({
  orderBy,
  loggedInUserId,
  ...args
}: FindDevelopmentsArgs): Promise<Development[]> => {
  const rawDevelopments = await db.development.findMany({
    orderBy: { createdAt: "desc", ...orderBy },
    ...args,
    ...developmentArgs,
  });

  const developments = rawDevelopments.map((raw) => {
    return convertDevelopment(raw, loggedInUserId);
  });

  return developments;
};

export const findDevelopment = async (
  developmentId: string,
  loggedInUserId: string | undefined
): Promise<Development | undefined> => {
  const rawDevelopment = await db.development.findUnique({
    where: { id: developmentId },
    ...developmentArgs,
  });

  if (!rawDevelopment) {
    return undefined;
  }

  const development = convertDevelopment(rawDevelopment, loggedInUserId);
  return development;
};
