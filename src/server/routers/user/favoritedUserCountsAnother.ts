import { z } from "zod";
import { db } from "../../prismadb";
import { publicProcedure } from "../../trpc";

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
