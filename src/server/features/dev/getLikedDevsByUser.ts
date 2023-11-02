import { Dev } from "@/models/dev";
import { publicProcedure } from "@/server/lib/trpc";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getLikedDevsByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async (): Promise<{ list: Dev[]; allPages: number }> => {
    // TODO:
    // 指定されたユーザーがいいねした開発情報のidを取得する
    // const [likedDevIdsObj, { allPages }] = await paginate({
    //   finder: ({ input, ...args }) =>
    //     db.developmentLike.findMany({ ...input, ...args }),
    //   finderInput: {
    //     select: { developmentId: true },
    //     where: { userId: input.userId },
    //   } satisfies Prisma.DevelopmentLikeFindManyArgs,
    //   counter: ({ select: _, ...args }) => db.developmentLike.count(args),
    //   pagingData: { page, limit: PAGE_LIMIT.likedDevs },
    // });
    // const likedDevIds = likedDevIdsObj.map((d) => d.developmentId);
    // // いいねした開発情報を取得
    // const likedDevs =
    //   likedDevIds.length === 0
    //     ? []
    //     : await findManyDevs({
    //         loggedInUserId: ctx.session?.user.id,
    //         args: {
    //           where: (devs, { inArray }) => {
    //             return inArray(devs.id, likedDevIds);
    //           },
    //         },
    //       });
    // const sortedLikedDevs = sortedInSameOrder({
    //   target: likedDevs,
    //   base: likedDevIds,
    //   getKey: (t) => t.id,
    // });
    // return { list: sortedLikedDevs, allPages };
    return { list: [], allPages: 0 };
  });
