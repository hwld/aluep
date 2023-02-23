import { z } from "zod";
import { prisma } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const likedTheme = publicProcedure
  .input(z.object({ themeId: z.string().min(1) }))
  .query(async ({ input, ctx }): Promise<boolean> => {
    const loggedInUser = ctx.session?.user;
    if (!loggedInUser) {
      return false;
    }

    const like = await prisma.appThemeLike.findUnique({
      where: {
        userId_appThemeId: {
          appThemeId: input.themeId,
          userId: loggedInUser.id,
        },
      },
    });

    return Boolean(like);
  });
