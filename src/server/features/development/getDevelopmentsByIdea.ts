import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema/util";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyDevelopments } from "../../models/development";

export const getDevelopmentsByIdea = publicProcedure
  .input(z.object({ ideaId: z.string(), page: pagingSchema }))
  .query(async ({ input: { page }, input, ctx }) => {
    const [developments, { allPages }] = await paginate({
      finderInput: {
        where: { ideaId: input.ideaId },
        loggedInUserId: ctx.session?.user.id,
      },
      finder: findManyDevelopments,
      counter: ({ loggedInUserId, ...others }) => db.development.count(others),
      pagingData: { page, limit: pageLimit.developments },
    });

    return { list: developments, allPages };
  });
