import { z } from "zod";
import { pageSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { findManyThemes } from "../../models/theme";
import { prisma } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const getLikedThemesByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pageSchema }))
  .query(async ({ input, input: { page } }) => {
    //お題にいいねしてあるモデルの中から自分のIDを取得
    const likeThemeIds = await prisma.appThemeLike.findMany({
      select: { appThemeId: true },
      where: { userId: input.userId },
    });
    const likeThemeList = likeThemeIds.map((like) => like.appThemeId);

    const { data: likePostedTheme, allPages } = await paginate({
      finder: findManyThemes,
      finderInput: { where: { id: { in: likeThemeList } } },
      counter: prisma.appTheme.count,
      pagingData: { page, limit: 18 },
    });

    return { likePostedTheme, allPages };
  });
