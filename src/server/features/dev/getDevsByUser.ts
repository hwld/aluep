import { Dev } from "@/models/dev";
import { publicProcedure } from "@/server/lib/trpc";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getDevsByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({}): Promise<{ list: Dev[]; allPages: number }> => {
    // TODO:
    // const [devs, { allPages }] = await paginate({
    //   finder: ({ input, ...args }) => findManyDevs({ ...input, ...args }),
    //   finderInput: {
    //     where: { userId: input.userId },
    //     loggedInUserId: ctx.session?.user.id,
    //   } satisfies FindDevsArgs,
    //   counter: ({ loggedInUserId: _, ...others }) => {
    //     return db.development.count(others);
    //   },
    //   pagingData: { page, limit: PAGE_LIMIT.devsByUser },
    // });

    return { list: [], allPages: 0 };
  });
