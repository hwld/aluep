import { z } from "zod";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const getDevelopmentLikeCountByUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const postThemeIds = await db.appThemeDevelopment.findMany({
      select: { id: true },
      where: { userId: input.userId },
    });
    const ids = postThemeIds.map((like) => like.id);
    const likes = await db.appThemeDevelopmentLike.count({
      where: { developmentId: { in: ids } },
    });
    return likes;
  });
