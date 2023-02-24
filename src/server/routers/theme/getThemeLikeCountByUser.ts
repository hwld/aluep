import { z } from "zod";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const getThemeLikeCountByUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    //whereで条件に一致するidを取得
    const postThemeIds = await db.appTheme.findMany({
      select: { id: true },
      where: { userId: input.userId },
    });
    const ids = postThemeIds.map((like) => like.id);
    const likes = await db.appThemeLike.count({
      where: { appThemeId: { in: ids } },
    });
    return likes;
  });
