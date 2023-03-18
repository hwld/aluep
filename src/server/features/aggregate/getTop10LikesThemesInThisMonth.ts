import { sortedInSameOrder } from "../../../share/utils";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyThemes } from "../../models/theme";

export const getTop10LikesThemesInThisMonth = publicProcedure.query(
  async () => {
    const themes = await db.$transaction(async (tx) => {
      // お題のidのリストを取得する
      type ThemeIdObjs = { themeId: string }[];
      const themeIdObjs = await tx.$queryRaw<ThemeIdObjs>`
      SELECT
        Theme.id as themeId
        , COUNT(ThemeLike.id) as likeCount
        , MIN(Theme.createdAt) as firstPostDatetime
      FROM
        AppThemeLike as ThemeLike
        LEFT JOIN AppTheme as Theme
          ON (ThemeLike.appThemeId = Theme.id)
      WHERE
        Theme.createdAt > (NOW() - INTERVAL 1 MONTh)
      GROUP BY
        Theme.id
      ORDER BY
        likeCount DESC
        , firstPostDatetime ASC
      LIMIT
        10
    `;
      const themeIds = themeIdObjs.map(({ themeId }) => themeId);

      const themes = await findManyThemes(
        { where: { id: { in: themeIds } } },
        tx
      );

      // themeIdsに並び順を合わせる
      const sortedThemes = sortedInSameOrder({
        target: themes,
        base: themeIds,
        getKey: (t) => t.id,
      });

      return sortedThemes;
    });

    return themes;
  }
);
