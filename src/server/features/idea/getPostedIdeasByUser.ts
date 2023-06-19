import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyIdeas } from "../../models/idea";

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
