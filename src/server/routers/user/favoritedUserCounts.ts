import { z } from "zod";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const favoritedUserCounts = publicProcedure
  .input(z.object({ favoriteUserId: z.string() }))
  .query(async ({ input }) => {
    const favoritedSum = await db.favoriteUser.count({
      where: {
        favoritedUserId: input.favoriteUserId,
      },
    });
    if (favoritedSum === 0) {
      return 0;
    }
    return favoritedSum;
  });
