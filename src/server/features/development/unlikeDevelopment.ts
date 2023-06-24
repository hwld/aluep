import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const unlikeDevelopment = requireLoggedInProcedure
  .input(z.object({ developmentId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const deletedLike = await db.developmentLike.delete({
      where: {
        userId_developmentId: {
          developmentId: input.developmentId,
          userId: ctx.session.user.id,
        },
      },
    });

    return { developmentId: deletedLike.developmentId };
  });
