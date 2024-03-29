import { findManyIdeas } from "@/server/finders/idea";
import { paginate } from "@/server/lib/paginate";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { PAGE_LIMIT } from "@/share/consts";
import { pagingSchema } from "@/share/paging";
import { sortedInSameOrder } from "@/share/utils";
import { z } from "zod";

export const getLikedIdeasByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page }, ctx }) => {
    // 指定されたユーザーがいいねしたお題のidを取得する
    const [likedIdeaIdObjs, { allPages }] = await paginate(
      db.ideaLike.findMany,
      {
        finderInput: {
          select: { ideaId: true },
          where: { userId: input.userId },
        },
        counter: ({ select: _, ...args }) => db.ideaLike.count(args),
        pagingData: { page, limit: PAGE_LIMIT.likedIdeas },
      }
    );
    const likedIdeaIds = likedIdeaIdObjs.map((l) => l.ideaId);

    // いいねしたお題の情報を取得
    const likedIdeas = await findManyIdeas({
      where: { id: { in: likedIdeaIds } },
      loggedInUserId: ctx.session?.user.id,
    });

    const sortedLikedIdeas = sortedInSameOrder({
      target: likedIdeas,
      base: likedIdeaIds,
      getKey: (t) => t.id,
    });

    return { list: sortedLikedIdeas, allPages };
  });
