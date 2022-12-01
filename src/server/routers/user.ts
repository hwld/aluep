import { z } from "zod";
import { findManyThemes } from "../models/theme";
import { publicProcedure, router } from "../trpc";

export const userRoute = router({
  getPostTheme: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const allThemes = await findManyThemes({ userId: input.userId });

      return allThemes;
    }),
});
