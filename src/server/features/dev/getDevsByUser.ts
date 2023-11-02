import { findManyDevs } from "@/server/finders/dev";
import { paginate } from "@/server/lib/paginate";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { PAGE_LIMIT } from "@/share/consts";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getDevsByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page }, ctx }) => {
    const [devs, { allPages }] = await paginate(findManyDevs)({
      finderInput: {
        where: { userId: input.userId },
        loggedInUserId: ctx.session?.user.id,
      },
      counter: ({ loggedInUserId: _, ...others }) => {
        return db.development.count(others);
      },
      pagingData: { page, limit: PAGE_LIMIT.devsByUser },
    });

    return { list: devs, allPages };
  });
