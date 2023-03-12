import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { sortedInSameOrder } from "../../../share/utils";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyThemes } from "../../models/theme";

export const getJoinedThemesByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    const [developments, { allPages }] = await paginate({
      finder: db.appThemeDevelopment.findMany,
      finderInput: { where: { userId: input.userId } },
      counter: db.appThemeDevelopment.count,
      pagingData: { page, limit: pageLimit.joinedThemes },
    });

    const joinedThemeIds = developments.map((t) => t.appThemeId);

    const joinedThemes = await findManyThemes({
      where: { id: { in: joinedThemeIds } },
    });

    const sortedJoinedThemes = sortedInSameOrder({
      target: joinedThemes,
      base: joinedThemeIds,
      getKey: (t) => t.id,
    });

    return { list: sortedJoinedThemes, allPages };
  });
