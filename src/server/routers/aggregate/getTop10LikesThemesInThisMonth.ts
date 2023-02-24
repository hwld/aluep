import { findManyThemes } from "../../models/theme";
import { db } from "../../prismadb";
import { publicProcedure } from "../../trpc";

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
      const sortedThemes = themes.sort((a, b) => {
        return themeIds.indexOf(a.id) - themeIds.indexOf(b.id);
      });

      return sortedThemes;
    });

    return themes;
  }
);
