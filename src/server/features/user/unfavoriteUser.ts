import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const unfavoriteUser = requireLoggedInProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async () => {
    // await db.favoriteUser.delete({
    //   where: {
    //     favoriteByUserId_favoritedUserId: {
    //       favoriteByUserId: ctx.session.user.id,
    //       favoritedUserId: input.userId,
    //     },
    //   },
    // });
  });
