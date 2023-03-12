import { Prisma } from "@prisma/client";
import { OmitStrict } from "../../types/OmitStrict";
import { db } from "../lib/prismadb";

export type ThemeDevelopment = {
  id: string;
  themeId: string;
  userId: string;
  name: string | null;
  image: string | null;
  githubUrl: string;
  comment: string;
  likes: number;
  likedByLoggedInUser: boolean;
  createdAt: string;
};

const developmentArgs = Prisma.validator<Prisma.AppThemeDevelopmentArgs>()({
  include: { user: true, likes: true },
});
const convertDevelopment = (
  raw: Prisma.AppThemeDevelopmentGetPayload<typeof developmentArgs>,
  loggedInUserId: string | undefined
): ThemeDevelopment => {
  const development: ThemeDevelopment = {
    id: raw.id,
    themeId: raw.appThemeId,
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

type FindThemeDevelopmentsArgs = OmitStrict<
  Prisma.AppThemeDevelopmentFindManyArgs,
  "include" | "select"
> & {
  loggedInUserId: string | undefined;
};
export const findManyThemeDevelopments = async ({
  orderBy,
  loggedInUserId,
  ...args
}: FindThemeDevelopmentsArgs): Promise<ThemeDevelopment[]> => {
  const rawDevelopments = await db.appThemeDevelopment.findMany({
    orderBy: { createdAt: "desc", ...orderBy },
    ...args,
    ...developmentArgs,
  });

  const developments = rawDevelopments.map((raw) => {
    return convertDevelopment(raw, loggedInUserId);
  });

  return developments;
};

export const findThemeDevelopment = async (
  developmentId: string,
  loggedInUserId: string | undefined
): Promise<ThemeDevelopment | undefined> => {
  const rawDevelopment = await db.appThemeDevelopment.findUnique({
    where: { id: developmentId },
    ...developmentArgs,
  });

  if (!rawDevelopment) {
    return undefined;
  }

  const development = convertDevelopment(rawDevelopment, loggedInUserId);
  return development;
};
