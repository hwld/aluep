import { z } from "zod";
import { db } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const getDeveloperLikeCountByUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const postThemeIds = await db.appThemeDeveloper.findMany({
      select: { id: true },
      where: { userId: input.userId },
    });
    const ids = postThemeIds.map((like) => like.id);
    const likes = await db.appThemeDeveloperLike.count({
      where: { developerId: { in: ids } },
    });
    return likes;
  });
