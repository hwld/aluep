import { z } from "zod";
import { prisma } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const favorited = publicProcedure
  .input(z.object({ userId: z.string(), favoriteUserId: z.string() }))
  .query(async ({ input }): Promise<boolean> => {
    const favorite = await prisma.favoriteUser.findUnique({
      where: {
        userId_favoritedUserId: {
          userId: input.userId,
          favoritedUserId: input.favoriteUserId,
        },
      },
    });
    return Boolean(favorite);
  });
