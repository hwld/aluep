import { z } from "zod";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const getDevelopmentLikeCountByUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const postIdeaIds = await db.development.findMany({
      select: { id: true },
      where: { userId: input.userId },
    });
    const ids = postIdeaIds.map((like) => like.id);
    const likes = await db.developmentLike.count({
      where: { developmentId: { in: ids } },
    });
    return likes;
  });
