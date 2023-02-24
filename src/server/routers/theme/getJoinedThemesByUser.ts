import { z } from "zod";
import { pageSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { findManyThemes } from "../../models/theme";
import { db } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const getJoinedThemesByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pageSchema }))
  .query(async ({ input, input: { page } }) => {
    //すべての開発者からユーザを抽出
    const joinTheme = await db.appThemeDeveloper.findMany({
      where: { userId: input.userId },
    });
    //テーマのidだけを抽出
    const joinThemeList = joinTheme.map((theme) => theme.appThemeId);

    const { data: joinPostedTheme, allPages } = await paginate({
      finder: findManyThemes,
      finderInput: { where: { id: { in: joinThemeList } } },
      counter: db.appTheme.count,
      pagingData: { page, limit: 18 },
    });

    return { joinPostedTheme, allPages };
  });
