import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyThemes } from "../../models/theme";

export const getLikedThemesByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    // 指定されたユーザーがいいねしたお題のidを取得する
    const [likedThemeIdObjs, { allPages }] = await paginate({
      finder: db.appThemeLike.findMany,
      finderInput: {
        select: { appThemeId: true },
        where: { userId: input.userId },
      },
      counter: ({ select, ...args }) => db.appThemeLike.count(args),
      pagingData: { page, limit: pageLimit.likedThemes },
    });
    const likedThemeIds = likedThemeIdObjs.map((l) => l.appThemeId);

    //お題にいいねしてあるモデルの中から自分のIDを取得
    const likedThemes = await findManyThemes({
      where: { id: { in: likedThemeIds } },
    });

    // TODO: likedThemeIdsとlikedThemesの並び順を合わせる

    return { list: likedThemes, allPages };
  });
