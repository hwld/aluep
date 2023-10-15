import { findManyIdeas } from "@/server/finders/idea";
import { paginate } from "@/server/lib/paginate";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { pageLimit } from "@/share/consts";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getPostedIdeasByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page }, ctx }) => {
    const [postedIdeas, { allPages }] = await paginate({
      finder: findManyIdeas,
      finderInput: {
        args: { where: { userId: input.userId } },
        loggedInUserId: ctx.session?.user.id,
      },
      counter: ({ args }) => db.idea.count(args),
      pagingData: { page, limit: pageLimit.postedIdeas },
    });

    return { list: postedIdeas, allPages };
  });
