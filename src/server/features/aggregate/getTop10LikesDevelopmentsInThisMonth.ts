import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { UserAndDevelopmentLikes } from "@/server/repositories/user";
import { sortedInSameOrder } from "@/share/utils";

export const getTop10LikesDevelopmentsInThisMonth = publicProcedure.query(
  async () => {
    const developmentUsers: UserAndDevelopmentLikes[] = await db.$transaction(
      async (tx) => {
        // ユーザーidのリストを取得する
        type RawDevelopmentUser = { userId: string; likeCount: BigInt }[];
        const rawDevelopmentUser = await tx.$queryRaw<RawDevelopmentUser>`
      SELECT
        users.id as "userId"
        , COUNT(development_likes.id) as "likeCount"
        , MIN(developments."createdAt") as "firstDevelopDatetime"
      FROM
        development_likes
        LEFT JOIN developments
          ON (development_likes."developmentId" = developments.id)
        LEFT JOIN users
          ON (developments."userId" = users.id)
      WHERE
        development_likes."createdAt" > (NOW() - INTERVAL '1 MONTH')
      GROUP BY
        users.id
      ORDER BY
        "likeCount" DESC
        , "firstDevelopDatetime" ASC
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
