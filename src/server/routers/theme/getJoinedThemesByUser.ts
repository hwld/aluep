import { z } from "zod";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyThemes } from "../../models/theme";

export const getJoinedThemesByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    //すべての開発者からユーザを抽出
    const joinTheme = await db.appThemeDeveloper.findMany({
      where: { userId: input.userId },
    });
    //テーマのidだけを抽出
    const joinThemeList = joinTheme.map((theme) => theme.appThemeId);

    const [joinPostedThemePerPage, { allPages }] = await paginate({
      finder: findManyThemes,
      finderInput: { where: { id: { in: joinThemeList } } },
      counter: db.appTheme.count,
      pagingData: { page, limit: 18 },
    });

    return { list: joinPostedThemePerPage, allPages };
  });
