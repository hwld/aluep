import { z } from "zod";
import { pageSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { findManyThemeDevelopers } from "../../models/themeDeveloper";
import { prisma } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const getDevelopers = publicProcedure
  .input(z.object({ themeId: z.string(), page: pageSchema }))
  .query(async ({ input: { page }, input, ctx }) => {
    const { data: developers, allPages } = await paginate({
      finderInput: {
        where: { appThemeId: input.themeId },
        loggedInUserId: ctx.session?.user.id,
      },
      finder: findManyThemeDevelopers,
      counter: ({ loggedInUserId, ...others }) =>
        prisma.appThemeDeveloper.count(others),
      pagingData: { page, limit: 20 },
    });

    return { developers, allPages };
  });
