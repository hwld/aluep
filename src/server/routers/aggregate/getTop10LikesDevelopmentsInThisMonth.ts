import { sortedInSameOrder } from "../../../share/utils";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { UserAndDevelopmentLikes } from "../../models/user";

export const getTop10LikesDevelopmentsInThisMonth = publicProcedure.query(
  async () => {
    const developmentUsers: UserAndDevelopmentLikes[] = await db.$transaction(
      async (tx) => {
        // ユーザーidのリストを取得する
        type RawDevelopmentUser = { userId: string; likeCount: BigInt }[];
        const rawDevelopmentUser = await tx.$queryRaw<RawDevelopmentUser>`
      SELECT
        User.id as userId
        , COUNT(DevLike.id) as likeCount
        , MIN(Development.createdAt) as firstDevelopDatetime
      FROM
        AppThemeDevelopmentLike as DevLike
        LEFT JOIN AppThemeDevelopment as Development
          ON (DevLike.developmentId = Development.id)
        LEFT JOIN User
          ON (Development.userId = User.id)
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
        const developmentUserIds = rawDevelopmentUser.map(
          ({ userId }) => userId
        );

        // ユーザーを取得する
        const users = await tx.user.findMany({
          where: { id: { in: developmentUserIds } },
        });

        const sortedUsers = sortedInSameOrder({
          target: users,
          base: developmentUserIds,
          getKey: (t) => t.id,
        });

        // sortedUsersにlikeCountをつける
        const usersAndDevelopmentLikes = sortedUsers.map(
          (user, i): UserAndDevelopmentLikes => ({
            ...user,
            developmentLikes: Number(rawDevelopmentUser[i]?.likeCount) ?? 0,
          })
        );

        return usersAndDevelopmentLikes;
      }
    );

    return developmentUsers;
  }
);
