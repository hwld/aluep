import { findManyIdeas } from "@/server/finders/idea";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { sortedInSameOrder } from "@/share/utils";
import { z } from "zod";

export const getPopularIdeas = publicProcedure
  .input(z.object({ limit: z.number() }))
  .query(async ({ input: { limit }, ctx }) => {
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
      GROUP BY
        ideas.id
      ORDER BY
        "likeCount" DESC
        , "firstPostDatetime" ASC
      LIMIT
        ${limit}
    `;
      const ideaIds = ideaIdObjs.map(({ ideaId }) => ideaId);

      const ideas = await findManyIdeas({
        args: { where: (ideas, { inArray }) => inArray(ideas.id, ideaIds) },
        // TODO:
        // transactionClient: tx,
        loggedInUserId: ctx.session?.user.id,
      });

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
