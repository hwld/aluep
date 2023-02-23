import { z } from "zod";
import { JoinData } from "../../../share/schema";
import { prisma } from "../../prismadb";
import { publicProcedure } from "../../trpc";

export const joinedTheme = publicProcedure
  .input(z.object({ themeId: z.string() }))
  .query(async ({ input, ctx }): Promise<JoinData> => {
    const loggedInUser = ctx.session?.user;
    if (!loggedInUser) {
      return { joined: false };
    }

    const developer = await prisma.appThemeDeveloper.findUnique({
      where: {
        userId_appThemeId: {
          userId: loggedInUser.id,
          appThemeId: input.themeId,
        },
      },
      select: { id: true },
    });
    if (!developer) {
      return { joined: false };
    }

    return { joined: true, developerId: developer.id };
  });
