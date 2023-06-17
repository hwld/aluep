import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import {
  FindDevelopmentsArgs,
  findManyDevelopments,
} from "../../models/development";

export const getDevelopmentsByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page }, ctx }) => {
    const [developments, { allPages }] = await paginate({
      finder: findManyDevelopments,
      finderInput: {
        where: { userId: input.userId },
        loggedInUserId: ctx.session?.user.id,
      } satisfies FindDevelopmentsArgs,
      counter: (loggedInUserId, ...others) => db.development.count(...others),
      pagingData: { page, limit: pageLimit.developmentsByUser },
    });

    return { list: developments, allPages };
  });
