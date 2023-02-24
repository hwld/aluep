import { z } from "zod";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const favoritedUserCountsAnother = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const favoritedSum = await db.favoriteUser.count({
      where: {
        favoritedUserId: input.userId,
      },
    });
    if (favoritedSum === 0) {
      return 0;
    }
    return favoritedSum;
  });
