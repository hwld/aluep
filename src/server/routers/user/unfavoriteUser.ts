import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const unfavoriteUser = requireLoggedInProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    await db.favoriteUser.delete({
      where: {
        userId_favoritedUserId: {
          userId: input.userId,
          favoritedUserId: ctx.session.user.id,
        },
      },
    });
  });
