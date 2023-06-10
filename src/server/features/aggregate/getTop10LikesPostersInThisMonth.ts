import { sortedInSameOrder } from "../../../share/utils";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { UserAndIdeaLikes } from "../../models/user";

export const getTop10LikesPostersInThisMonth = publicProcedure.query(
  async () => {
    const posterUsers: UserAndIdeaLikes[] = await db.$transaction(
      async (tx) => {
        type RawPosterUser = { userId: string; likeCount: BigInt }[];
        // このクエリが原因?
        const rawPosterUser = await tx.$queryRaw<RawPosterUser>`
        SELECT
          users.id as "userId"
          , COUNT(idea_likes.id) as "likeCount"
          , MIN(ideas."createdAt") as "firstPostDatetime"
        FROM
          idea_likes
          LEFT JOIN ideas
            ON (idea_likes."ideaId" = ideas.id)
          LEFT JOIN users
            ON (ideas."userId" = users.id)
        WHERE
          idea_likes."createdAt" > (NOW() - INTERVAL '1 MONTH')
        GROUP BY
          users.id
        ORDER BY
          "likeCount" DESC
          , "firstPostDatetime" ASC
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

        const usersAndIdeaLikes = sortedUsers.map(
          (user, i): UserAndIdeaLikes => ({
            ...user,
            ideaLikes: Number(rawPosterUser[i]?.likeCount) ?? 0,
          })
        );

        return usersAndIdeaLikes;
      }
    );

    return posterUsers;
  }
);
