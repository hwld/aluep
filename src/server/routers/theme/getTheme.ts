import { z } from "zod";
import { publicProcedure } from "../../lib/trpc";
import { findTheme, Theme } from "../../models/theme";

export const getTheme = publicProcedure
  .input(z.object({ themeId: z.string() }))
  .query(async ({ input }): Promise<Theme | undefined> => {
    const theme = await findTheme({ id: input.themeId });
    return theme;
  });
