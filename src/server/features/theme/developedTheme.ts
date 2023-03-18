import { z } from "zod";
import { DevelopedData } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const developedTheme = publicProcedure
  .input(z.object({ themeId: z.string() }))
  .query(async ({ input, ctx }): Promise<DevelopedData> => {
    const loggedInUser = ctx.session?.user;
    if (!loggedInUser) {
      return { developed: false };
    }

    const development = await db.appThemeDevelopment.findUnique({
      where: {
        userId_appThemeId: {
          userId: loggedInUser.id,
          appThemeId: input.themeId,
        },
      },
      select: { id: true },
    });
    if (!development) {
      return { developed: false };
    }

    return { developed: true, developmentId: development.id };
  });
