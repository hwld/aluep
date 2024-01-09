import { UserAndIdeaLikes } from "@/server/finders/user";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { sortedInSameOrder } from "@/share/utils";
import { z } from "zod";

export const getPopularIdeaAuthors = publicProcedure
  .input(z.object({ limit: z.number() }))
  .query(async ({ input: { limit } }) => {
    const ideaAuthors: UserAndIdeaLikes[] = await db.$transaction(
      async (tx) => {
        type RawIdeaAuthor = { userId: string; likeCount: BigInt }[];
        // このクエリが原因?
        const rawIdeaAuthor = await tx.$queryRaw<RawIdeaAuthor>`
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
          ${limit}
      `;

        const ideaAuthorIds = rawIdeaAuthor.map(({ userId }) => userId);

        // ユーザーを取得する
        const users = await tx.user.findMany({
          where: { id: { in: ideaAuthorIds } },
        });

        // ideaAuthorIdsはランキング順通りになっているが、prismaでinを通すと順番が不定になるので
        // ideaAuthorIdsの順に並び変える
        const sortedUsers = sortedInSameOrder({
          target: users,
          base: ideaAuthorIds,
          getKey: (t) => t.id,
        });

        const usersAndIdeaLikes = sortedUsers.map(
          (user, i): UserAndIdeaLikes => ({
            ...user,
            ideaLikes: Number(rawIdeaAuthor[i]?.likeCount) ?? 0,
          })
        );

        return usersAndIdeaLikes;
      },
      {
        maxWait: 20000,
        timeout: 60000,
      }
    );

    return ideaAuthors;
  });
