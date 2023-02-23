import { z } from "zod";
import {
  pageSchema,
  themeOrderSchema,
  themePeriodSchema,
} from "../../../share/schema";
import { searchThemes, Theme } from "../../models/theme";
import { publicProcedure } from "../../trpc";

export const searchTheme = publicProcedure
  .input(
    z.object({
      keyword: z.string(),
      tagIds: z.array(z.string().min(1)),
      order: themeOrderSchema,
      period: themePeriodSchema,
      page: pageSchema,
    })
  )
  .query(async ({ input }): Promise<{ themes: Theme[]; allPages: number }> => {
    const paginatedThemes = await searchThemes(
      {
        keyword: input.keyword,
        tagIds: input.tagIds,
        order: input.order,
        period: input.period,
      },
      { page: input.page, limit: 24 }
    );

    return paginatedThemes;
  });
