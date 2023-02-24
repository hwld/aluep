import { z } from "zod";
import { pageSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { findManyThemeDevelopers } from "../../models/themeDeveloper";
import { db } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const getDevelopersByTheme = publicProcedure
  .input(z.object({ themeId: z.string(), page: pageSchema }))
  .query(async ({ input: { page }, input, ctx }) => {
    const { data: developers, allPages } = await paginate({
      finderInput: {
        where: { appThemeId: input.themeId },
        loggedInUserId: ctx.session?.user.id,
      },
      finder: findManyThemeDevelopers,
      counter: ({ loggedInUserId, ...others }) =>
        db.appThemeDeveloper.count(others),
      pagingData: { page, limit: 20 },
    });

    return { developers, allPages };
  });
