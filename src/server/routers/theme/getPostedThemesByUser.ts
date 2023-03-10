import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyThemes } from "../../models/theme";

export const getPostedThemesByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    const [postedThemesPerPage, { allPages }] = await paginate({
      finder: findManyThemes,
      finderInput: { where: { userId: input.userId } },
      counter: db.appTheme.count,
      pagingData: { page, limit: pageLimit.postedThemes },
    });

    return { list: postedThemesPerPage, allPages };
  });
