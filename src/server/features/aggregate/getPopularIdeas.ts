import { Idea } from "@/models/idea";
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const getPopularIdeas = publicProcedure
  .input(z.object({ limit: z.number() }))
  .query(async (): Promise<Idea[]> => {
    // TODO:
    // const ideas = await db.$transaction(async (tx) => {
    //   // お題のidのリストを取得する
    //   type IdeaIdObjs = { ideaId: string }[];
    //   const ideaIdObjs = await tx.$queryRaw<IdeaIdObjs>`
    //   SELECT
    //     ideas.id as "ideaId"
    //     , COUNT(idea_likes.id) as "likeCount"
    //     , MIN(ideas."createdAt") as "firstPostDatetime"
    //   FROM
    //     idea_likes
    //     LEFT JOIN ideas
    //       ON (idea_likes."ideaId" = ideas.id)
    //   GROUP BY
    //     ideas.id
    //   ORDER BY
    //     "likeCount" DESC
    //     , "firstPostDatetime" ASC
    //   LIMIT
    //     ${limit}
    // `;
    //   const ideaIds = ideaIdObjs.map(({ ideaId }) => ideaId);

    //   const ideas =
    //     ideaIds.length === 0
    //       ? []
    //       : await findManyIdeas({
    //           args: {
    //             where: (ideas, { inArray }) => inArray(ideas.id, ideaIds),
    //           },
    //           // TODO:
    //           // transactionClient: tx,
    //           loggedInUserId: ctx.session?.user.id,
    //         });

    //   // ideaIdsに並び順を合わせる
    //   const sortedIdeas = sortedInSameOrder({
    //     target: ideas,
    //     base: ideaIds,
    //     getKey: (t) => t.id,
    //   });

    //   return sortedIdeas;
    // });

    // return ideas;
    return [];
  });
