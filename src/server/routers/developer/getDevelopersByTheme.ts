import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyThemeDevelopers } from "../../models/themeDeveloper";

export const getDevelopersByTheme = publicProcedure
  .input(z.object({ themeId: z.string(), page: pagingSchema }))
  .query(async ({ input: { page }, input, ctx }) => {
    const [developersPerPage, { allPages }] = await paginate({
      finderInput: {
        where: { appThemeId: input.themeId },
        loggedInUserId: ctx.session?.user.id,
      },
      finder: findManyThemeDevelopers,
      counter: ({ loggedInUserId, ...others }) =>
        db.appThemeDeveloper.count(others),
      pagingData: { page, limit: pageLimit.developers },
    });

    return { list: developersPerPage, allPages };
  });
