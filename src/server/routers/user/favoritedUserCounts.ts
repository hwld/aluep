import { z } from "zod";
import { db } from "../../prismadb";
import { publicProcedure } from "../../trpc";

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
