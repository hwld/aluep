import { z } from "zod";
import { pageSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyThemes } from "../../models/theme";

export const getPostedThemesByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pageSchema }))
  .query(async ({ input, input: { page } }) => {
    const [postedThemesPerPage, { allPages }] = await paginate({
      finder: findManyThemes,
      finderInput: { where: { userId: input.userId } },
      counter: db.appTheme.count,
      pagingData: { page, limit: 18 },
    });

    return { list: postedThemesPerPage, allPages };
  });
