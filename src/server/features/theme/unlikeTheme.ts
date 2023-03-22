import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const unlikeTheme = requireLoggedInProcedure
  .input(z.object({ themeId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const deletedLike = await db.appThemeLike.delete({
      where: {
        userId_appThemeId: {
          appThemeId: input.themeId,
          userId: ctx.session.user.id,
        },
      },
    });

    return { themeId: deletedLike.appThemeId };
  });
