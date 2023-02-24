import { z } from "zod";
import { prisma } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const getThemeLikeCountByUser = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    //whereで条件に一致するidを取得
    const postThemeIds = await prisma.appTheme.findMany({
      select: { id: true },
      where: { userId: input.userId },
    });
    const ids = postThemeIds.map((like) => like.id);
    const likes = await prisma.appThemeLike.count({
      where: { appThemeId: { in: ids } },
    });
    return likes;
  });
