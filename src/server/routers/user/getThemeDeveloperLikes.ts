import { z } from "zod";
import { prisma } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const getThemeDeveloperLikes = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input }) => {
    const postThemeIds = await prisma.appThemeDeveloper.findMany({
      select: { id: true },
      where: { userId: input.userId },
    });
    const ids = postThemeIds.map((like) => like.id);
    const likes = await prisma.appThemeDeveloperLike.count({
      where: { developerId: { in: ids } },
    });
    return likes;
  });
