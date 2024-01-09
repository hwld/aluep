import { UserAndDevLikes } from "@/server/finders/user";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { sortedInSameOrder } from "@/share/utils";
import { z } from "zod";

export const getPopularDevelopers = publicProcedure
  .input(z.object({ limit: z.number() }))
  .query(async ({ input: { limit } }) => {
    // TODO:
    // 重たい処理をトランザクション内でやるべきじゃないかもしれない・・・。
    // 他のaggregateでも集計処理は事前に計算しておいてここではreadだけで済ませたい
    // 今はとりあえずタイムアウトの時間を伸ばす。
    const devUsers: UserAndDevLikes[] = await db.$transaction(
      async (tx) => {
        // ユーザーidのリストを取得する
        type RawDevUser = { userId: string; likeCount: BigInt }[];
        const rawDevUser = await tx.$queryRaw<RawDevUser>`
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
      GROUP BY
        users.id
      ORDER BY
        "likeCount" DESC
        , "firstDevelopDatetime" ASC
      LIMIT
        ${limit}
    `;
        const devUserIds = rawDevUser.map(({ userId }) => userId);

        // ユーザーを取得する
        const users = await tx.user.findMany({
          where: { id: { in: devUserIds } },
        });

        const sortedUsers = sortedInSameOrder({
          target: users,
          base: devUserIds,
          getKey: (t) => t.id,
        });

        // sortedUsersにlikeCountをつける
        const usersAndDevLikes = sortedUsers.map(
          (user, i): UserAndDevLikes => ({
            ...user,
            devLikes: Number(rawDevUser[i]?.likeCount) ?? 0,
          })
        );

        return usersAndDevLikes;
      },
      {
        maxWait: 20000,
        timeout: 60000,
      }
    );

    return devUsers;
  });
