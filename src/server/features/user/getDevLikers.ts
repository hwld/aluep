import { DevLikers } from "@/models/devLike";
import { publicProcedure } from "@/server/lib/trpc";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getDevLikers = publicProcedure
  .input(z.object({ devId: z.string(), page: pagingSchema }))
  .query(async (): Promise<{ list: DevLikers[]; allPages: number }> => {
    // const [devLikes, { allPages }] = await paginate({
    //   finderInput: {
    //     where: { developmentId: input.devId },
    //     orderBy: { createdAt: "desc" },
    //   } satisfies Prisma.DevelopmentLikeFindManyArgs,
    //   finder: ({ input, ...args }) =>
    //     db.developmentLike.findMany({ ...input, ...args }),
    //   counter: db.developmentLike.count,
    //   pagingData: { page, limit: PAGE_LIMIT.ideaLikers },
    // });
    // const likerIds = devLikes.map(({ userId }) => userId);
    // const users = likerIds.length
    //   ? await findManyUsers({
    //       where: (users, { inArray }) => {
    //         return inArray(users.id, likerIds);
    //       },
    //     })
    //   : [];
    // const sortedUsers = sortedInSameOrder({
    //   target: users,
    //   base: likerIds,
    //   getKey: (t) => t.id,
    // });
    // const devLikers: DevLikers[] = sortedUsers.map((user, i) => ({
    //   ...user,
    //   likedDate: devLikes[i].createdAt,
    // }));
    // return { list: devLikers, allPages };

    return { list: [], allPages: 0 };
  });
