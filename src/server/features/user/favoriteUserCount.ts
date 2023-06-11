import { z } from "zod";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const getFavoriteCountByUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    return await db.favoriteUser.count({
      where: { favoriteByUserId: input.userId },
    });
  });
