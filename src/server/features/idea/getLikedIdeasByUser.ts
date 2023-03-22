import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { sortedInSameOrder } from "../../../share/utils";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyIdeas } from "../../models/idea";

export const getLikedIdeasByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    // 指定されたユーザーがいいねしたお題のidを取得する
    const [likedIdeaIdObjs, { allPages }] = await paginate({
      finder: db.ideaLike.findMany,
      finderInput: {
        select: { ideaId: true },
        where: { userId: input.userId },
      },
      counter: ({ select, ...args }) => db.ideaLike.count(args),
      pagingData: { page, limit: pageLimit.likedIdeas },
    });
    const likedIdeaIds = likedIdeaIdObjs.map((l) => l.ideaId);

    //お題にいいねしてあるモデルの中から自分のIDを取得
    const likedIdeas = await findManyIdeas({
      where: { id: { in: likedIdeaIds } },
    });

    const sortedLikedIdeas = sortedInSameOrder({
      target: likedIdeas,
      base: likedIdeaIds,
      getKey: (t) => t.id,
    });

    return { list: sortedLikedIdeas, allPages };
  });
