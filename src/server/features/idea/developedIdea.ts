import { z } from "zod";
import { DevelopedData } from "../../../share/schema";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const isDevelopedByLoggedInUser = publicProcedure
  .input(z.object({ ideaId: z.string() }))
  .query(async ({ input, ctx }): Promise<DevelopedData> => {
    const loggedInUser = ctx.session?.user;
    if (!loggedInUser) {
      return { developed: false };
    }

    const development = await db.development.findUnique({
      where: {
        userId_ideaId: {
          userId: loggedInUser.id,
          ideaId: input.ideaId,
        },
      },
      select: { id: true },
    });
    if (!development) {
      return { developed: false };
    }

    return { developed: true, developmentId: development.id };
  });
