import { z } from "zod";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const isFavoritedByLoggedInUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input, ctx }): Promise<boolean> => {
    const loggedInUserId = ctx.session?.user.id;
    if (!loggedInUserId) {
      return false;
    }

    const favorite = await db.favoriteUser.findUnique({
      where: {
        favoriteByUserId_favoritedUserId: {
          favoriteByUserId: loggedInUserId,
          favoritedUserId: input.userId,
        },
      },
    });
    return Boolean(favorite);
  });
