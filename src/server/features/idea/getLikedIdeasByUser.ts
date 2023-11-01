import { findManyIdeas } from "@/server/finders/idea";
import { __new_db__ } from "@/server/lib/db";
import { publicProcedure } from "@/server/lib/trpc";
import { pagingSchema } from "@/share/paging";
import { sortedInSameOrder } from "@/share/utils";
import { z } from "zod";

export const getLikedIdeasByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ ctx }) => {
    // 指定されたユーザーがいいねしたお題のidを取得する
    // TODO
    // const [likedIdeaIdObjs, { allPages }] = await paginate({
    //   finder: __new_db__.query.ideaLikes.findMany,
    //   finderInput: {
    //     columns: { ideaId: true },
    //     where: (likes, { eq }) => eq(likes.userId, input.userId),
    //   },
    //   counter: ({ select, ...args }) => db.ideaLike.count(args),
    //   pagingData: { page, limit: PAGE_LIMIT.likedIdeas },
    // });
    // const likedIdeaIds = likedIdeaIdObjs.map((l) => l.ideaId);

    // いいねしたお題の情報を取得
    const likedIdeas = await findManyIdeas({
      args: { where: (ideas, { inArray }) => inArray(ideas.id, []) },
      loggedInUserId: ctx.session?.user.id,
    });

    const sortedLikedIdeas = sortedInSameOrder({
      target: likedIdeas,
      // base: likedIdeaIds,
      base: [],
      getKey: (t) => t.id,
    });

    // TODO:
    return { list: sortedLikedIdeas, allPages: 0 };
  });
