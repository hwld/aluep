import { Prisma } from "@prisma/client";
import { OmitStrict } from "../../types/OmitStrict";
import { db } from "../lib/prismadb";

export type ThemeDeveloper = {
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

const developerArgs = Prisma.validator<Prisma.AppThemeDeveloperArgs>()({
  include: { user: true, likes: true },
});
const convertDeveloper = (
  raw: Prisma.AppThemeDeveloperGetPayload<typeof developerArgs>,
  loggedInUserId: string | undefined
): ThemeDeveloper => {
  const developer: ThemeDeveloper = {
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

  return developer;
};

type FindThemeDevelopersArgs = OmitStrict<
  Prisma.AppThemeDeveloperFindManyArgs,
  "include" | "select"
> & {
  loggedInUserId: string | undefined;
};
export const findManyThemeDevelopers = async ({
  orderBy,
  loggedInUserId,
  ...args
}: FindThemeDevelopersArgs): Promise<ThemeDeveloper[]> => {
  const rawDevelopers = await db.appThemeDeveloper.findMany({
    orderBy: { createdAt: "desc", ...orderBy },
    ...args,
    ...developerArgs,
  });

  const developers = rawDevelopers.map((raw) => {
    return convertDeveloper(raw, loggedInUserId);
  });

  return developers;
};

export const findThemeDeveloper = async (
  developerId: string,
  loggedInUserId: string | undefined
): Promise<ThemeDeveloper | undefined> => {
  const rawDeveloper = await db.appThemeDeveloper.findUnique({
    where: { id: developerId },
    ...developerArgs,
  });

  if (!rawDeveloper) {
    return undefined;
  }

  const developer = convertDeveloper(rawDeveloper, loggedInUserId);
  return developer;
};
