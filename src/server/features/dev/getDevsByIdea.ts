import { findManyDevs } from "@/server/finders/dev";
import { paginate } from "@/server/lib/paginate";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { pageLimit } from "@/share/consts";
import { pagingSchema } from "@/share/paging";
import { z } from "zod";

export const getDevsByIdea = publicProcedure
  .input(z.object({ ideaId: z.string(), page: pagingSchema }))
  .query(async ({ input: { page }, input, ctx }) => {
    const [devs, { allPages }] = await paginate({
      finderInput: {
        where: { ideaId: input.ideaId },
        loggedInUserId: ctx.session?.user.id,
      },
      finder: findManyDevs,
      counter: ({ loggedInUserId, ...others }) => db.development.count(others),
      pagingData: { page, limit: pageLimit.devs },
    });

    return { list: devs, allPages };
  });
