import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { sortedInSameOrder } from "../../../share/utils";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyIdeas } from "../../models/idea";

export const getDevelopedIdeasByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    const [developments, { allPages }] = await paginate({
      finder: db.development.findMany,
      finderInput: { where: { userId: input.userId } },
      counter: db.development.count,
      pagingData: { page, limit: pageLimit.developedIdeas },
    });

    const developedIdeaIds = developments.map((t) => t.ideaId);

    const developedIdeas = await findManyIdeas({
      where: { id: { in: developedIdeaIds } },
    });

    const sortedDevelopedIdeas = sortedInSameOrder({
      target: developedIdeas,
      base: developedIdeaIds,
      getKey: (t) => t.id,
    });

    return { list: sortedDevelopedIdeas, allPages };
  });
