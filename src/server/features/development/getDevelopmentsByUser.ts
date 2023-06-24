import { paginate } from "@/server/lib/paginate";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import {
  FindDevelopmentsArgs,
  findManyDevelopments,
} from "@/server/repositories/development";
import { pageLimit } from "@/share/consts";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getDevelopmentsByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page }, ctx }) => {
    const [developments, { allPages }] = await paginate({
      finder: findManyDevelopments,
      finderInput: {
        where: { userId: input.userId },
        loggedInUserId: ctx.session?.user.id,
      } satisfies FindDevelopmentsArgs,
      counter: ({ loggedInUserId, ...others }) => {
        return db.development.count(others);
      },
      pagingData: { page, limit: pageLimit.developmentsByUser },
    });

    return { list: developments, allPages };
  });
