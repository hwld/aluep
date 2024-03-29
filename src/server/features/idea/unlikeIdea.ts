import { db } from "@/server/lib/prismadb";
import { requireLoggedInProcedure } from "@/server/lib/trpc";
import { z } from "zod";

export const unlikeIdea = requireLoggedInProcedure
  .input(z.object({ ideaId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const deletedLike = await db.ideaLike.delete({
      where: {
        userId_ideaId: {
          ideaId: input.ideaId,
          userId: ctx.session.user.id,
        },
      },
    });

    return { ideaId: deletedLike.ideaId };
  });
