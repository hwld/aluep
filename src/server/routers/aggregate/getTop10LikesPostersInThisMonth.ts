import { sortedInSameOrder } from "../../../share/utils";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { UserAndThemeLikes } from "../../models/user";

export const getTop10LikesPostersInThisMonth = publicProcedure.query(
  async () => {
    const posterUsers: UserAndThemeLikes[] = await db.$transaction(
      async (tx) => {
        type RawPosterUser = { userId: string; likeCount: BigInt }[];
        // このクエリが原因?
        const rawPosterUser = await tx.$queryRaw<RawPosterUser>`
        SELECT
          User.id as userId
          , COUNT(ThemeLike.id) as likeCount
          , MIN(Theme.createdAt) as firstPostDatetime
        FROM
          AppThemeLike as ThemeLike
          LEFT JOIN AppTheme as Theme
            ON (ThemeLike.appThemeId = Theme.id)
          LEFT JOIN User
            ON (Theme.userId = User.id)
        WHERE
          ThemeLike.createdAt > (NOW() - INTERVAL 1 MONTH)
        GROUP BY
          User.id
        ORDER BY
          likeCount DESC
          , firstPostDatetime ASC
        LIMIT
          10
      `;

        const posterUserIds = rawPosterUser.map(({ userId }) => userId);

        // ユーザーを取得する
        const users = await tx.user.findMany({
          where: { id: { in: posterUserIds } },
        });

        // posterUserIdsはランキング順通りになっているが、prismaでinを通すと順番が不定になるので
        // posterUseridsの順に並び変える
        const sortedUsers = sortedInSameOrder({
          target: users,
          base: posterUserIds,
          getKey: (t) => t.id,
        });

        const usersAndThemeLikes = sortedUsers.map(
          (user, i): UserAndThemeLikes => ({
            ...user,
            themeLikes: Number(rawPosterUser[i]?.likeCount) ?? 0,
          })
        );

        return usersAndThemeLikes;
      }
    );

    return posterUsers;
  }
);
