import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../prismadb";

export const themeDeveloperSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  githubUrl: z.string(),
  comment: z.string(),
  likes: z.number(),
  likedByLoggedInUser: z.boolean(),
  createdAt: z.string(),
});
export type ThemeDeveloper = z.infer<typeof themeDeveloperSchema>;

const developerArgs = Prisma.validator<Prisma.AppThemeDeveloperArgs>()({
  include: { user: true, likes: true },
});
const convertDeveloper = (
  raw: Prisma.AppThemeDeveloperGetPayload<typeof developerArgs>,
  loggedInUserId: string | undefined
): ThemeDeveloper => {
  const developer: ThemeDeveloper = {
    id: raw.id,
    userId: raw.user.id,
    name: raw.user.name,
    image: raw.user.image,
    githubUrl: raw.githubUrl,
    comment: raw.githubUrl,
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

type FindThemeDevelopersArgs = {
  where?: Prisma.AppThemeDeveloperWhereInput;
  loggedInUserId: string | undefined;
};
export const findThemeDevelopers = async ({
  where,
  loggedInUserId,
}: FindThemeDevelopersArgs): Promise<ThemeDeveloper[]> => {
  const rawDevelopers = await prisma.appThemeDeveloper.findMany({
    where,
    ...developerArgs,
  });
  const developers = rawDevelopers.map((raw) => {
    return convertDeveloper(raw, loggedInUserId);
  });

  return developers;
};
