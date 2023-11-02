import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const getFavoriteCountByUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    return await db.favoriteUser.count({
      where: { favoriteByUserId: input.userId },
    });
  });
