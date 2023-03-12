import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyThemeDevelopments } from "../../models/themeDevelopment";

export const getDevelopmentsByTheme = publicProcedure
  .input(z.object({ themeId: z.string(), page: pagingSchema }))
  .query(async ({ input: { page }, input, ctx }) => {
    const [developmentsPerPage, { allPages }] = await paginate({
      finderInput: {
        where: { appThemeId: input.themeId },
        loggedInUserId: ctx.session?.user.id,
      },
      finder: findManyThemeDevelopments,
      counter: ({ loggedInUserId, ...others }) =>
        db.appThemeDevelopment.count(others),
      pagingData: { page, limit: pageLimit.developments },
    });

    return { list: developmentsPerPage, allPages };
  });
