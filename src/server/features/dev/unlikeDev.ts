import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const unlikeDev = requireLoggedInProcedure
  .input(z.object({ devId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const deletedLike = await db.developmentLike.delete({
      where: {
        userId_developmentId: {
          developmentId: input.devId,
          userId: ctx.session.user.id,
        },
      },
    });

    return { devId: deletedLike.developmentId };
  });
