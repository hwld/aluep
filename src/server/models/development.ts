import { Prisma } from "@prisma/client";
import { OmitStrict } from "../../types/OmitStrict";
import { db } from "../lib/prismadb";

export type Development = {
  id: string;
  ideaId: string;
  userId: string;
  name: string | null;
  image: string | null;
  githubUrl: string;
  comment: string;
  likes: number;
  likedByLoggedInUser: boolean;
  createdAt: string;
};

const developmentArgs = Prisma.validator<Prisma.DevelopmentArgs>()({
  include: { user: true, likes: true },
});
const convertDevelopment = (
  raw: Prisma.DevelopmentGetPayload<typeof developmentArgs>,
  loggedInUserId: string | undefined
): Development => {
  const development: Development = {
    id: raw.id,
    ideaId: raw.ideaId,
    userId: raw.user.id,
    name: raw.user.name,
    image: raw.user.image,
    githubUrl: raw.githubUrl,
    comment: raw.comment,
    likes: raw.likes.length,
    // ログインユーザーがいいねしているか
    likedByLoggedInUser: raw.likes.find(
      (like) => like.userId === loggedInUserId
    )
      ? true
      : false,
    createdAt: raw.createdAt.toUTCString(),
  };

  return development;
};

type FindDevelopmentsArgs = OmitStrict<
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
