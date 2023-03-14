import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { sortedInSameOrder } from "../../../share/utils";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyThemes } from "../../models/theme";

export const getDevelopedThemesByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    const [developments, { allPages }] = await paginate({
      finder: db.appThemeDevelopment.findMany,
      finderInput: { where: { userId: input.userId } },
      counter: db.appThemeDevelopment.count,
      pagingData: { page, limit: pageLimit.developedThemes },
    });

    const developedThemeIds = developments.map((t) => t.appThemeId);

    const developedThemes = await findManyThemes({
      where: { id: { in: developedThemeIds } },
    });

    const sortedDevelopedThemes = sortedInSameOrder({
      target: developedThemes,
      base: developedThemeIds,
      getKey: (t) => t.id,
    });

    return { list: sortedDevelopedThemes, allPages };
  });
