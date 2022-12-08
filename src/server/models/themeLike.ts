import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../prismadb";

export const themeLikeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  githubUrl: z.string(),
  likedByLoggedInUser: z.boolean(),
  createdAt: z.string(),
  
});
export type ThemeLike = z.infer<typeof themeLikeSchema>;
const LikeArgs = Prisma.validator<Prisma.AppThemeDeveloperArgs>()({
  include: { user: true, likes: true },
});

  const convertLike = (
    raw: Prisma.AppThemeDeveloperGetPayload<typeof LikeArgs>,
    loggedInUserId: string | undefined
  ): ThemeLike => {
    const user: ThemeLike = {
      id: raw.id,
      userId: raw.user.id,
      name: raw.user.name,
      image: raw.user.image,
      githubUrl: raw.githubUrl,
      // ログインユーザーがいいねしているか
      likedByLoggedInUser: raw.likes.find(
        (like) => like.userId === loggedInUserId
      )
        ? true
        : false,
      createdAt: raw.createdAt.toUTCString(),
    };
  
    return user;
  };

type FindThemeDevelopersArgs = {
  where?: Prisma.AppThemeDeveloperWhereInput;
  loggedInUserId: string | undefined;
};
export const findThemeDevelopers = async ({
  where,
  loggedInUserId,
}: FindThemeDevelopersArgs): Promise<ThemeLike[]> => {
  const rawLike = await prisma.appThemeDeveloper.findMany({
    where,
    ...LikeArgs,
  });
  const users = rawLike.map((raw) => {
    return convertLike(raw, loggedInUserId);
  });

  return users;
};