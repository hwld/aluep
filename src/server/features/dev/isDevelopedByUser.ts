import { DevelopedData } from "@/models/dev";
import { db } from "@/server/lib/prismadb";
import { publicProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const isDevelopedByUser = publicProcedure
  .input(z.object({ ideaId: z.string(), userId: z.string().nullable() }))
  .query(async ({ input }): Promise<DevelopedData> => {
    const loginUserId = input.userId;
    if (!loginUserId) {
      return { developed: false };
    }

    const dev = await db.development.findUnique({
      where: {
        userId_ideaId: {
          userId: loginUserId,
          ideaId: input.ideaId,
        },
      },
      select: { id: true },
    });
    if (!dev) {
      return { developed: false };
    }

    return { developed: true, devId: dev.id };
  });
