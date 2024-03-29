import { findManyDevs } from "@/server/finders/dev";
import { paginate } from "@/server/lib/paginate";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { PAGE_LIMIT } from "@/share/consts";
import { pagingSchema } from "@/share/paging";
import { sortedInSameOrder } from "@/share/utils";
import { z } from "zod";

export const getLikedDevsByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page }, ctx }) => {
    // 指定されたユーザーがいいねした開発情報のidを取得する
    const [likedDevIdsObj, { allPages }] = await paginate(
      db.developmentLike.findMany,
      {
        finderInput: {
          select: { developmentId: true },
          where: { userId: input.userId },
        },
        counter: ({ select: _, ...args }) => db.developmentLike.count(args),
        pagingData: { page, limit: PAGE_LIMIT.likedDevs },
      }
    );
    const likedDevIds = likedDevIdsObj.map((d) => d.developmentId);

    // いいねした開発情報を取得
    const likedDevs = await findManyDevs({
      loggedInUserId: ctx.session?.user.id,
      where: { id: { in: likedDevIds } },
    });

    const sortedLikedDevs = sortedInSameOrder({
      target: likedDevs,
      base: likedDevIds,
      getKey: (t) => t.id,
    });

    return { list: sortedLikedDevs, allPages };
  });
