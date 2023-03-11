import { z } from "zod";
import { pageLimit } from "../../../share/consts";
import { pagingSchema } from "../../../share/schema";
import { paginate } from "../../lib/paginate";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";
import { findManyThemes } from "../../models/theme";

export const getJoinedThemesByUser = publicProcedure
  .input(z.object({ userId: z.string(), page: pagingSchema }))
  .query(async ({ input, input: { page } }) => {
    const [developers, { allPages }] = await paginate({
      finder: db.appThemeDeveloper.findMany,
      finderInput: { where: { userId: input.userId } },
      counter: db.appThemeDeveloper.count,
      pagingData: { page, limit: pageLimit.joinedThemes },
    });

    const joinedThemeIds = developers.map((t) => t.appThemeId);

    const joinedThemes = await findManyThemes({
      where: { id: { in: joinedThemeIds } },
    });

    // TODO: joinedThemesをjoinedThemeIdsの並び順に合わせる

    return { list: joinedThemes, allPages };
  });
