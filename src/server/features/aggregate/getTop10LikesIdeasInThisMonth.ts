import { findManyIdeas } from "@/server/finders/idea";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { sortedInSameOrder } from "@/share/utils";

export const getTop10LikesIdeasInThisMonth = publicProcedure.query(async () => {
  const ideas = await db.$transaction(async (tx) => {
    // お題のidのリストを取得する
    type IdeaIdObjs = { ideaId: string }[];
    const ideaIdObjs = await tx.$queryRaw<IdeaIdObjs>`
      SELECT
        ideas.id as "ideaId"
        , COUNT(idea_likes.id) as "likeCount"
        , MIN(ideas."createdAt") as "firstPostDatetime"
      FROM
        idea_likes
        LEFT JOIN ideas
          ON (idea_likes."ideaId" = ideas.id)
      WHERE
        ideas."createdAt" > (NOW() - INTERVAL '1 MONTH')
      GROUP BY
        ideas.id
      ORDER BY
        "likeCount" DESC
        , "firstPostDatetime" ASC
      LIMIT
        10
    `;
    const ideaIds = ideaIdObjs.map(({ ideaId }) => ideaId);

    const ideas = await findManyIdeas({ where: { id: { in: ideaIds } } }, tx);

    // ideaIdsに並び順を合わせる
    const sortedIdeas = sortedInSameOrder({
      target: ideas,
      base: ideaIds,
      getKey: (t) => t.id,
    });

    return sortedIdeas;
  });

  return ideas;
});
