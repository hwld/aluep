import { z } from "zod";
import { db } from "../../prismadb";
import { requireLoggedInProcedure } from "../../trpc";

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
