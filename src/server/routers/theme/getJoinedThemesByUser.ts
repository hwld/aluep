import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyThemes } from "../../models/theme";

export const getJoinedThemesByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    // TODO: joinThemeをpaginateする

    //すべての開発者からユーザを抽出
    const joinTheme = await db.appThemeDeveloper.findMany({
      where: { userId: input.userId },
    });
    //テーマのidだけを抽出
    const joinThemeList = joinTheme.map((theme) => theme.appThemeId);

    const [joinedThemesPerPage, { allPages }] = await paginate({
      finder: findManyThemes,
      finderInput: { where: { id: { in: joinThemeList } } },
      counter: db.appTheme.count,
      pagingData: { page, limit: pageLimit.joinedThemes },
    });

    return { list: joinedThemesPerPage, allPages };
  });
