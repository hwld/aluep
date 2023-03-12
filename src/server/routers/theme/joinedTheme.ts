import { z } from "zod";
import { JoinData } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const joinedTheme = publicProcedure
  .input(z.object({ themeId: z.string() }))
  .query(async ({ input, ctx }): Promise<JoinData> => {
    const loggedInUser = ctx.session?.user;
    if (!loggedInUser) {
      return { joined: false };
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
      return { joined: false };
    }

    return { joined: true, developmentId: development.id };
  });
