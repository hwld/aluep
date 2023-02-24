import { z } from "zod";
import { db } from "../../lib/prismadb";
import { requireLoggedInProcedure } from "../../lib/trpc";

export const favoriteUser = requireLoggedInProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    await db.favoriteUser.create({
      data: {
        userId: input.userId,
        favoritedUserId: ctx.session.user.id,
      },
    });
  });
