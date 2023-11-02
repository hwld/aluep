import { findManyIdeas } from "@/server/finders/idea";
import { paginate } from "@/server/lib/paginate";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { PAGE_LIMIT } from "@/share/consts";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getPostedIdeasByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page }, ctx }) => {
    const [postedIdeas, { allPages }] = await paginate(findManyIdeas)({
      finderInput: {
        where: { userId: input.userId },
        loggedInUserId: ctx.session?.user.id,
      },
      counter: ({ loggedInUserId: _, ...args }) => db.idea.count(args),
      pagingData: { page, limit: PAGE_LIMIT.postedIdeas },
    });

    return { list: postedIdeas, allPages };
  });
