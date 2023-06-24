import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const favoriteUser = requireLoggedInProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    await db.favoriteUser.create({
      data: {
        favoriteByUserId: ctx.session.user.id,
        favoritedUserId: input.userId,
      },
    });
  });
