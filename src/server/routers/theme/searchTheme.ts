import { searchThemeSchema } from "../../../share/schema";
import { publicProcedure } from "../../lib/trpc";
import { searchThemes, Theme } from "../../models/theme";

export const searchTheme = publicProcedure
  .input(searchThemeSchema)
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
