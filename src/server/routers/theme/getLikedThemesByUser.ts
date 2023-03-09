import { z } from "zod";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyThemes } from "../../models/theme";

export const getLikedThemesByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    //お題にいいねしてあるモデルの中から自分のIDを取得
    const likeThemeIds = await db.appThemeLike.findMany({
      select: { appThemeId: true },
      where: { userId: input.userId },
    });
    const likeThemeList = likeThemeIds.map((like) => like.appThemeId);

    const [likedThemesPerPage, { allPages }] = await paginate({
      finder: findManyThemes,
      finderInput: { where: { id: { in: likeThemeList } } },
      counter: db.appTheme.count,
      pagingData: { page, limit: 18 },
    });

    return { list: likedThemesPerPage, allPages };
  });
