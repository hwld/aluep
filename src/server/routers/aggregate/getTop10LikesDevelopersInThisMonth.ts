import { sortedInSameOrder } from "../../../share/utils";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { UserAndDeveloperLikes } from "../../models/user";

export const getTop10LikesDevelopersInThisMonth = publicProcedure.query(
  async () => {
    const developerUsers: UserAndDeveloperLikes[] = await db.$transaction(
      async (tx) => {
        // ユーザーidのリストを取得する
        type RawDeveloperUser = { userId: string; likeCount: BigInt }[];
        const rawDeveloperUser = await tx.$queryRaw<RawDeveloperUser>`
      SELECT
        User.id as userId
        , COUNT(DevLike.id) as likeCount
        , MIN(Developer.createdAt) as firstDevelopDatetime
      FROM
        AppThemeDeveloperLike as DevLike
        LEFT JOIN AppThemeDeveloper as Developer
          ON (DevLike.developerId = Developer.id)
        LEFT JOIN User
          ON (Developer.userId = User.id)
      WHERE
        DevLike.createdAt > (NOW() - INTERVAL 1 MONTH)
      GROUP BY
        User.id
      ORDER BY
        likeCount DESC
        , firstDevelopDatetime ASC
      LIMIT
        10
    `;
        const developerUserIds = rawDeveloperUser.map(({ userId }) => userId);

        // ユーザーを取得する
        const users = await tx.user.findMany({
          where: { id: { in: developerUserIds } },
        });

        // developerUserIdsはランキング順どおりになっているが、prismaでinを通すと順番が不定になるので、
        // developeruserIdsの順に並び変える
        const sortedUsers = sortedInSameOrder({
          target: users,
          base: developerUserIds,
          getKey: (t) => t.id,
        });

        // sortedUsersにlikeCountをつける
        const usersAndDeveloperLikes = sortedUsers.map(
          (user, i): UserAndDeveloperLikes => ({
            ...user,
            developerLikes: Number(rawDeveloperUser[i]?.likeCount) ?? 0,
          })
        );

        return usersAndDeveloperLikes;
      }
    );

    return developerUsers;
  }
);
