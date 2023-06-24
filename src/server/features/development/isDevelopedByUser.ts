import { z } from "zod";
import { DevelopedData } from "../../../share/schema/development";
import { db } from "../../lib/prismadb";
import { publicProcedure } from "../../lib/trpc";

export const isDevelopedByUser = publicProcedure
  .input(z.object({ ideaId: z.string(), userId: z.string().nullable() }))
  .query(async ({ input }): Promise<DevelopedData> => {
    const loginUserId = input.userId;
    if (!loginUserId) {
      return { developed: false };
    }

    const development = await db.development.findUnique({
      where: {
        userId_ideaId: {
          userId: loginUserId,
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
