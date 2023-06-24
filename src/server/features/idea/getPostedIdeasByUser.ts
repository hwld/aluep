import { paginate } from "@/server/lib/paginate";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { findManyIdeas } from "@/server/repositories/idea";
import { pageLimit } from "@/share/consts";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getPostedIdeasByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    const [postedIdeas, { allPages }] = await paginate({
      finder: findManyIdeas,
      finderInput: { where: { userId: input.userId } },
      counter: db.idea.count,
      pagingData: { page, limit: pageLimit.postedIdeas },
    });

    return { list: postedIdeas, allPages };
  });
