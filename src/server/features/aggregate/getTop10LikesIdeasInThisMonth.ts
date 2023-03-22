import { sortedInSameOrder } from "../../../share/utils";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyIdeas } from "../../models/idea";

export const getTop10LikesIdeasInThisMonth = publicProcedure.query(async () => {
  const ideas = await db.$transaction(async (tx) => {
    // お題のidのリストを取得する
    type IdeaIdObjs = { ideaId: string }[];
    const ideaIdObjs = await tx.$queryRaw<IdeaIdObjs>`
      SELECT
        Idea.id as ideaId
        , COUNT(IdeaLike.id) as likeCount
        , MIN(Idea.createdAt) as firstPostDatetime
      FROM
        IdeaLike as IdeaLike
        LEFT JOIN Idea as Idea
          ON (IdeaLike.ideaId = Idea.id)
      WHERE
        Idea.createdAt > (NOW() - INTERVAL 1 MONTh)
      GROUP BY
        Idea.id
      ORDER BY
        likeCount DESC
        , firstPostDatetime ASC
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
