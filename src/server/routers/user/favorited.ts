import { z } from "zod";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const favorited = publicProcedure
  .input(z.object({ userId: z.string(), favoriteUserId: z.string() }))
  .query(async ({ input }): Promise<boolean> => {
    const favorite = await db.favoriteUser.findUnique({
      where: {
        userId_favoritedUserId: {
          userId: input.userId,
          favoritedUserId: input.favoriteUserId,
        },
      },
    });
    return Boolean(favorite);
  });
