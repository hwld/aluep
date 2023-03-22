import { z } from "zod";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const getIdeaLikeCountByUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    //whereで条件に一致するidを取得
    const postIdeaIds = await db.idea.findMany({
      select: { id: true },
      where: { userId: input.userId },
    });
    const ids = postIdeaIds.map((like) => like.id);
    const likes = await db.ideaLike.count({
      where: { ideaId: { in: ids } },
    });
    return likes;
  });
