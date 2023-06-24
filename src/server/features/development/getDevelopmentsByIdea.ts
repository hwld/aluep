import { paginate } from "@/server/lib/paginate";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { findManyDevelopments } from "@/server/models/development";
import { pageLimit } from "@/share/consts";
import { pagingSchema } from "@/share/schema/util";
import { z } from "zod";

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
